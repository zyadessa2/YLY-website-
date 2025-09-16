-- Insert all 27 governorates with proper slugs and data
INSERT INTO governorates (name, arabic_name, slug, description, arabic_description, population, area, capital, arabic_capital) VALUES

-- Major Governorates
('Cairo', 'القاهرة', 'cairo', 'Egypt''s capital and largest city, home to YLY''s central headquarters and numerous youth programs.', 'عاصمة مصر وأكبر مدنها، موطن المقر الرئيسي لـ YLY والعديد من برامج الشباب.', '10.2M', '606 km²', 'Cairo', 'القاهرة'),

('Giza', 'الجيزة', 'giza', 'Home to the Great Pyramids and active YLY volunteers organizing cultural and educational events.', 'موطن الأهرامات العظيمة ومتطوعي YLY النشطين الذين ينظمون فعاليات ثقافية وتعليمية.', '9.2M', '13,184 km²', 'Giza', 'الجيزة'),

('Alexandria', 'الإسكندرية', 'alexandria', 'Egypt''s Mediterranean pearl with vibrant YLY community programs and coastal activities.', 'عروس البحر المتوسط مع برامج مجتمعية نشطة لـ YLY وأنشطة ساحلية.', '5.4M', '2,679 km²', 'Alexandria', 'الإسكندرية'),

-- Delta Governorates
('Beheira', 'البحيرة', 'beheira', 'Western Delta governorate with strong agricultural YLY programs and rural development initiatives.', 'محافظة دلتا غربية مع برامج YLY زراعية قوية ومبادرات تنمية ريفية.', '6.2M', '9,826 km²', 'Damanhur', 'دمنهور'),

('Kafr El Sheikh', 'كفر الشيخ', 'kafr-el-sheikh', 'Northern Delta region where YLY focuses on agricultural youth training and environmental programs.', 'منطقة شمال الدلتا حيث يركز YLY على تدريب الشباب الزراعي والبرامج البيئية.', '3.4M', '3,748 km²', 'Kafr El Sheikh', 'كفر الشيخ'),

('Dakahlia', 'الدقهلية', 'dakahlia', 'Heart of the Nile Delta with active YLY chapters promoting education and sports programs.', 'قلب دلتا النيل مع فروع YLY نشطة تروج للتعليم والبرامج الرياضية.', '6.5M', '3,459 km²', 'Mansoura', 'المنصورة'),

('Damietta', 'دمياط', 'damietta', 'Coastal governorate where YLY organizes marine conservation and furniture industry training.', 'محافظة ساحلية حيث ينظم YLY الحفاظ على البحر وتدريب صناعة الأثاث.', '1.5M', '1,029 km²', 'Damietta', 'دمياط'),

('Sharqia', 'الشرقية', 'sharqia', 'Eastern Delta agricultural hub with YLY programs in farming technology and rural development.', 'مركز دلتا شرقي زراعي مع برامج YLY في تكنولوجيا الزراعة والتنمية الريفية.', '7.2M', '4,911 km²', 'Zagazig', 'الزقازيق'),

('Monufia', 'المنوفية', 'monufia', 'Central Delta governorate with YLY initiatives in textile industry and technical education.', 'محافظة دلتا وسطى مع مبادرات YLY في صناعة النسيج والتعليم التقني.', '4.3M', '1,532 km²', 'Shibin El Kom', 'شبين الكوم'),

('Gharbia', 'الغربية', 'gharbia', 'Industrial Delta region where YLY promotes manufacturing skills and entrepreneurship programs.', 'منطقة دلتا صناعية حيث يروج YLY لمهارات التصنيع وبرامج ريادة الأعمال.', '4.9M', '1,948 km²', 'Tanta', 'طنطا'),

('Qalyubia', 'القليوبية', 'qalyubia', 'Adjacent to Cairo with YLY programs bridging urban and rural youth development.', 'مجاورة للقاهرة مع برامج YLY التي تربط بين تنمية الشباب الحضري والريفي.', '5.6M', '1,124 km²', 'Benha', 'بنها'),

-- Upper Egypt Governorates
('Beni Suef', 'بني سويف', 'beni-suef', 'Central Egypt governorate with YLY programs in cement industry training and heritage preservation.', 'محافظة وسط مصر مع برامج YLY في تدريب صناعة الأسمنت وحفظ التراث.', '3.5M', '10,954 km²', 'Beni Suef', 'بني سويف'),

('Fayoum', 'الفيوم', 'fayoum', 'Oasis governorate where YLY focuses on sustainable agriculture and eco-tourism development.', 'محافظة واحة حيث يركز YLY على الزراعة المستدامة وتطوير السياحة البيئية.', '3.6M', '6,068 km²', 'Fayoum', 'الفيوم'),

('Minya', 'المنيا', 'minya', 'Upper Egypt cultural center with YLY programs in archaeology, arts, and rural development.', 'مركز ثقافي في صعيد مصر مع برامج YLY في الآثار والفنون والتنمية الريفية.', '5.5M', '32,279 km²', 'Minya', 'المنيا'),

('Assiut', 'أسيوط', 'assiut', 'Major Upper Egypt city with YLY university partnerships and technical education programs.', 'مدينة كبرى في صعيد مصر مع شراكات YLY الجامعية وبرامج التعليم التقني.', '4.4M', '25,926 km²', 'Assiut', 'أسيوط'),

('Sohag', 'سوهاج', 'sohag', 'Ancient Egyptian heartland where YLY promotes heritage tourism and cultural preservation.', 'قلب مصر القديمة حيث يروج YLY للسياحة التراثية والحفاظ على الثقافة.', '5.0M', '11,218 km²', 'Sohag', 'سوهاج'),

('Qena', 'قنا', 'qena', 'Historic governorate with YLY programs connecting ancient heritage with modern youth development.', 'محافظة تاريخية مع برامج YLY التي تربط التراث القديم بتنمية الشباب الحديثة.', '3.2M', '8,980 km²', 'Qena', 'قنا'),

('Luxor', 'الأقصر', 'luxor', 'World heritage site where YLY combines tourism training with archaeological preservation programs.', 'موقع تراث عالمي حيث يجمع YLY بين تدريب السياحة وبرامج حفظ الآثار.', '1.3M', '2,960 km²', 'Luxor', 'الأقصر'),

('Aswan', 'أسوان', 'aswan', 'Southern gateway with YLY initiatives in renewable energy and Nubian cultural programs.', 'البوابة الجنوبية مع مبادرات YLY في الطاقة المتجددة والبرامج الثقافية النوبية.', '1.5M', '679 km²', 'Aswan', 'أسوان'),

-- Canal & Sinai Governorates
('Suez', 'السويس', 'suez', 'Strategic canal city where YLY organizes maritime training and logistics programs.', 'مدينة قناة استراتيجية حيث ينظم YLY التدريب البحري وبرامج اللوجستيات.', '730K', '17,840 km²', 'Suez', 'السويس'),

('Ismailia', 'الإسماعيلية', 'ismailia', 'Canal governorate with YLY programs in international trade and cultural exchange.', 'محافظة القناة مع برامج YLY في التجارة الدولية والتبادل الثقافي.', '1.3M', '5,067 km²', 'Ismailia', 'الإسماعيلية'),

('Port Said', 'بورسعيد', 'port-said', 'Mediterranean port city with YLY maritime and trade development programs.', 'مدينة ميناء متوسطية مع برامج YLY البحرية وتطوير التجارة.', '750K', '1,351 km²', 'Port Said', 'بورسعيد'),

('North Sinai', 'شمال سيناء', 'north-sinai', 'Strategic peninsula region where YLY focuses on Bedouin youth integration and development.', 'منطقة شبه جزيرة استراتيجية حيث يركز YLY على دمج وتنمية الشباب البدوي.', '450K', '27,574 km²', 'Arish', 'العريش'),

('South Sinai', 'جنوب سيناء', 'south-sinai', 'Tourism and mining region with YLY programs in hospitality training and environmental conservation.', 'منطقة سياحة وتعدين مع برامج YLY في تدريب الضيافة والحفاظ على البيئة.', '170K', '31,272 km²', 'Tor', 'الطور'),

-- Frontier Governorates
('Red Sea', 'البحر الأحمر', 'red-sea', 'Coastal region where YLY promotes marine tourism and diving industry development.', 'منطقة ساحلية حيث يروج YLY للسياحة البحرية وتطوير صناعة الغوص.', '400K', '119,636 km²', 'Hurghada', 'الغردقة'),

('New Valley', 'الوادي الجديد', 'new-valley', 'Desert oasis governorate with YLY programs in agriculture innovation and desert development.', 'محافظة واحة صحراوية مع برامج YLY في ابتكار الزراعة وتطوير الصحراء.', '250K', '376,505 km²', 'Kharga', 'الخارجة'),

('Matrouh', 'مطروح', 'matrouh', 'Western desert and Mediterranean coast with YLY programs in Bedouin community development and coastal tourism.', 'الصحراء الغربية والساحل المتوسطي مع برامج YLY في تنمية المجتمع البدوي والسياحة الساحلية.', '450K', '212,112 km²', 'Mersa Matrouh', 'مرسى مطروح')

ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  arabic_description = EXCLUDED.arabic_description,
  population = EXCLUDED.population,
  area = EXCLUDED.area,
  capital = EXCLUDED.capital,
  arabic_capital = EXCLUDED.arabic_capital,
  updated_at = NOW();
