"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { eventsService, EventItem } from "@/lib/api";
import { getEventRegistrationStatus } from "@/lib/utils/event-status";
import { formatDate, formatTime } from "@/lib/utils/date-format";
import { getNextImageProps } from "@/lib/utils/google-drive-image";
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UsersIcon, 
  MailIcon, 
  PhoneIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface EventContentProps {
  content: string;
  images?: string[];
  title?: string;
  event?: EventItem;
}

export const EventContent = ({
  content,
  images,
  title,
  event,
}: EventContentProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  // Validation helpers
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return 'الاسم مطلوب';
    if (name.trim().length < 2) return 'الاسم يجب أن يكون حرفين على الأقل';
    if (name.trim().length > 100) return 'الاسم طويل جداً';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'البريد الإلكتروني مطلوب';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'البريد الإلكتروني غير صحيح';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return 'رقم الهاتف مطلوب';
    // Remove spaces, dashes, and parentheses
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    // Accept Egyptian phone formats:
    // 01xxxxxxxxx (11 digits starting with 01)
    // 1xxxxxxxxx (10 digits starting with 1)
    // +201xxxxxxxxx or 201xxxxxxxxx
    const egyptianPhone = /^(0?1[0125]\d{8}|(\+?20)1[0125]\d{8})$/;
    if (!egyptianPhone.test(cleaned)) {
      return 'رقم الهاتف غير صحيح (مثال: 01066958954)';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};
    
    errors.name = validateName(formData.name);
    errors.email = validateEmail(formData.email);
    errors.phone = validatePhone(formData.phone);
    
    setFieldErrors(errors);
    
    return !errors.name && !errors.email && !errors.phone;
  };

  // Get registration status
  const registrationStatus = event ? getEventRegistrationStatus({
    registrationEnabled: event.registrationEnabled,
    registrationDeadline: event.registrationDeadline,
    eventDate: event.eventDate,
    endDate: event.endDate,
    currentParticipants: event.currentParticipants,
    maxParticipants: event.maxParticipants,
    published: event.published,
  }) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event?._id) return;

    // Validate form first
    if (!validateForm()) {
      return;
    }

    setIsRegistering(true);
    setRegistrationError(null);

    try {
      await eventsService.register(event._id, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        notes: formData.notes?.trim() || undefined,
      });
      setRegistrationSuccess(true);
    } catch (error: unknown) {
      console.error('Registration error:', error);
      let message = 'فشل في التسجيل. حاول مرة أخرى.';
      
      // Handle axios error with response data
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; errors?: Record<string, string> } } };
        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        }
        // Handle field-specific errors from backend
        if (axiosError.response?.data?.errors) {
          setFieldErrors(axiosError.response.data.errors);
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      
      setRegistrationError(message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-8">
      {/* Event Details Card */}
      {event && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>تفاصيل الحدث</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">التاريخ</p>
                  <p className="font-medium">{formatDate(event.eventDate, 'ar')}</p>
                </div>
              </div>
              {event.eventTime && (
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">الوقت</p>
                    <p className="font-medium">{formatTime(event.eventTime, 'ar')}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">المكان</p>
                  <p className="font-medium">{event.arabicLocation || event.location}</p>
                </div>
              </div>
              {event.maxParticipants && (
                <div className="flex items-center gap-3">
                  <UsersIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">المشاركين</p>
                    <p className="font-medium">{event.currentParticipants || 0} / {event.maxParticipants}</p>
                  </div>
                </div>
              )}
              {event.contactEmail && (
                <div className="flex items-center gap-3">
                  <MailIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <a href={`mailto:${event.contactEmail}`} className="font-medium text-primary hover:underline">
                      {event.contactEmail}
                    </a>
                  </div>
                </div>
              )}
              {event.contactPhone && (
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">الهاتف</p>
                    <a href={`tel:${event.contactPhone}`} className="font-medium text-primary hover:underline">
                      {event.contactPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>
            {(event.requirements || event.arabicRequirements) && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">المتطلبات:</p>
                <p className="text-sm text-muted-foreground">{event.arabicRequirements || event.requirements}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-lg mx-auto max-w-none dark:prose-invert mb-8"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Image Gallery */}
      {images && images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="my-8 grid gap-6 md:grid-cols-2"
        >
          {images.map((image, index) => {
            const { src, unoptimized } = getNextImageProps(image);
            return (
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative aspect-video overflow-hidden rounded-xl"
              >
                <Image
                  src={src}
                  unoptimized={unoptimized}
                  alt={title || 'Event image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Registration Form */}
      {event && registrationStatus && (
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>التسجيل في الحدث</CardTitle>
              <Badge 
                variant={registrationStatus.canRegister ? "default" : "secondary"}
                className={registrationStatus.badgeColor === 'green' ? 'bg-green-500' : 
                  registrationStatus.badgeColor === 'orange' ? 'bg-orange-500' : ''}
              >
                {registrationStatus.badgeTextAr}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {registrationSuccess ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  تم تسجيلك بنجاح! سيتم التواصل معك قريباً.
                </AlertDescription>
              </Alert>
            ) : registrationStatus.canRegister ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {registrationError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{registrationError}</AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      required
                      minLength={2}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                      }}
                      placeholder="أدخل اسمك الكامل"
                      className={fieldErrors.name ? 'border-red-500' : ''}
                    />
                    {fieldErrors.name && (
                      <p className="text-sm text-red-500">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                      }}
                      placeholder="example@email.com"
                      className={fieldErrors.email ? 'border-red-500' : ''}
                    />
                    {fieldErrors.email && (
                      <p className="text-sm text-red-500">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
                      }}
                      placeholder="01012345678"
                      className={fieldErrors.phone ? 'border-red-500' : ''}
                    />
                    {fieldErrors.phone && (
                      <p className="text-sm text-red-500">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                  <Textarea
                    id="notes"
                    maxLength={500}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="أي ملاحظات إضافية..."
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري التسجيل...
                    </>
                  ) : (
                    'سجل الآن'
                  )}
                </Button>
              </form>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{registrationStatus.reasonAr}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
};
