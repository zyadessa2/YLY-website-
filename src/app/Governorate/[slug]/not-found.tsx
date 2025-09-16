import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <div className="relative">
              <MapPin className="w-10 h-10 text-orange-600" />
              <Search className="w-5 h-5 text-orange-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-3xl text-gray-900 mb-2">
            Governorate Not Found
          </CardTitle>
          <p className="text-lg text-gray-600">
            We couldn&apos;t find the governorate you&apos;re looking for.
          </p>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-semibold text-amber-800 mb-3">
              This could happen if:
            </h3>
            <ul className="text-sm text-amber-700 space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                The governorate name in the URL is misspelled
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                The governorate is not yet available in our system
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                The link you followed is outdated or incorrect
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-3">
              Available Egyptian Governorates:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-700">
              <div>Cairo • Alexandria</div>
              <div>Giza • Qalyubia</div>
              <div>Sharqia • Dakahlia</div>
              <div>Gharbia • Kafr El Sheikh</div>
              <div>Beheira • Menoufia</div>
              <div>Ismailia • Port Said</div>
              <div>Suez • North Sinai</div>
              <div>South Sinai • Fayoum</div>
              <div>Beni Suef • Minya</div>
              <div>Asyut • Sohag</div>
              <div>Qena • Luxor</div>
              <div>Aswan • Red Sea</div>
              <div>New Valley • Matrouh</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild className="flex-1" variant="default">
              <Link href="/Governorate">
                <MapPin className="w-4 h-4 mr-2" />
                Browse All Governorates
              </Link>
            </Button>

            <Button asChild variant="outline" className="flex-1">
              <Link href="javascript:history.back()">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Link>
            </Button>

            <Button asChild variant="ghost" className="flex-1">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home Page
              </Link>
            </Button>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If you believe this governorate should exist, please{" "}
              <Link href="/contactUs" className="text-blue-600 hover:underline">
                contact our support team
              </Link>{" "}
              for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
