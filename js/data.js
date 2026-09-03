/* ============================================================
   مزه کباب — داده‌های سایت
   -----------------------------------------------------------
   همه‌ی اطلاعات فقط از مدارک ارائه‌شده توسط رستوران:
   - منوی رسمی (صفحه اینستاگرامی)
   - کارت تماس و آدرس
   - تابلوی رستوران
   هیچ قیمت، ساعت کاری یا اطلاعات دیگری اختراع نشده است.
   برای اضافه کردن قیمت کافی است `price` هر آیتم را پر کنید
   (مثلاً price: '۲۸۵٬۰۰۰ تومان')؛ رابط کاربری به‌طور خودکار
   قیمت را به‌جای «استعلام قیمت» نمایش می‌دهد.
   ============================================================ */
(function () {
  'use strict';

  var restaurant = {
    name: 'مزه کباب',
    tagline: 'کباب ایرانی · قزوین',
    slogan: 'هیچ کبابی مزه کباب نمی‌شود',
    instagram: 'mazeh__kabab',
    instagramUrl: 'https://instagram.com/mazeh__kabab',
    phones: [
      { label: 'شماره موبایل', value: '09100913979', display: '۰۹۱۰ ۰۹۱ ۳۹۷۹' },
      { label: 'شماره ثابت', value: '02833644196', display: '۰۲۸ ۳۳۶ ۴۴۱۹۶' }
    ],
    address: {
      line1: 'قزوین، خیابان ملاصدرا، اندیشه ۱۳',
      line2: '',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=%D9%82%D8%B2%D9%88%DB%8C%D9%86%20%D9%85%D9%84%D8%A7%D8%B5%D8%AF%D8%B1%D8%A7%20%D8%A7%D9%86%D8%AF%DB%8C%D8%B4%D9%87%2013'
    },
    catering: {
      line1: 'قبول انواع سفارشات برای مجالس و مهمانی‌ها',
      line2: 'آماده عقد قرارداد با کلیه ادارات و شرکت‌ها'
    }
  };

  var categories = [
    { id: 'barreh', label: 'بره و گوسفندی' },
    { id: 'jojeh', label: 'جوجه' },
    { id: 'qazvin', label: 'ویژه قزوین' }
  ];

  /* 16 آیتم منو، دقیقاً مطابق منوی رسمی مزه کباب */
  var dishes = [
    { id: 'barg', cat: 'barreh', name: 'کباب برگ مخصوص', note: 'سیخِ برگ، به سبکِ مخصوصِ مزه کباب', img: 'assets/images/dish-barg.jpg', alt: 'سیخ‌های کباب برگ روی دیس با سبزی و گوجه‌ی گریل‌شده', featured: true, price: null },
    { id: 'chenge', cat: 'barreh', name: 'کباب چنگه مخصوص', note: 'چنگه، به سبکِ مخصوصِ مزه کباب', img: 'assets/images/dish-chenge.jpg', alt: 'دو سیخ کباب چنگه روی کاسه‌ی سفید با زیتون و گوجه', price: null },
    { id: 'torsh', cat: 'barreh', name: 'کباب ترش مخصوص', note: 'کبابِ ترش، به سبکِ مخصوصِ مزه کباب', img: 'assets/images/dish-torsh.jpg', alt: 'سیخ‌های کباب با ذرت و گوجه‌ی گریل‌شده روی دیس', price: null },
    { id: 'adana', cat: 'barreh', name: 'آدانا کباب', note: 'آدانا، به سبکِ مزه کباب', img: null, alt: '', price: null },
    { id: 'azmiri', cat: 'barreh', name: 'ازمیری کباب', note: 'ازمیری، به سبکِ مزه کباب', img: null, alt: '', price: null },
    { id: 'negini', cat: 'barreh', name: 'کباب نگینی مخصوص', note: 'نگینی، به سبکِ مخصوصِ مزه کباب', img: null, alt: '', price: null },
    { id: 'koo-bideh', cat: 'barreh', name: 'کباب کوبیده مخصوص', note: 'کوبیده، به سبکِ مخصوصِ مزه کباب', img: 'assets/images/dish-koo-bideh.jpg', alt: 'کباب کوبیده با گوجه‌ی گریل‌شده و فلفل سبز', price: null },
    { id: 'volosi', cat: 'barreh', name: 'کباب ولزی', note: 'ولزی، به سبکِ مزه کباب', img: null, alt: '', price: null },
    { id: 'koo-bideh-mormali', cat: 'barreh', name: 'کباب کوبیده معمولی', note: 'دو سیخ کوبیده‌ی معمولی', img: 'assets/images/dish-koo-bideh-mormali.jpg', alt: 'دو سیخ کباب با سیب‌زمینیِ تنوری و گوجه', price: null },
    { id: 'jojeh-torsh', cat: 'jojeh', name: 'جوجه ترش مخصوص', note: 'جوجه‌ی ترش، به سبکِ مخصوصِ مزه کباب', img: null, alt: '', price: null },
    { id: 'zaferani', cat: 'jojeh', name: 'جوجه کباب زعفرانی', note: 'جوجه کباب با عطر زعفران', img: 'assets/images/dish-zaferani.jpg', alt: 'سیخ جوجه کباب زعفرانی کنار برنج ذرتی', featured: true, price: null },
    { id: 'estokhan', cat: 'jojeh', name: 'اکبر جوجه', note: 'اکبر جوجه، به سبکِ مزه کباب', img: 'assets/images/dish-estokhan.jpg', alt: 'جوجه‌ی برشته با تفت و کنجد', price: null },
    { id: 'akbar', cat: 'jojeh', name: 'اکبر جوجه مزه کباب', note: '«اکبر جوجه»، به سبکِ مزه کباب', img: null, alt: '', price: null },
    { id: 'loumeh', cat: 'qazvin', name: 'لقمه مزه کباب', note: 'لقمه، به سبکِ مزه کباب', img: null, alt: '', featured: true, price: null },
    { id: 'che-lo-kare', cat: 'qazvin', name: 'چلو کره', note: 'چلو با کره، به سبکِ قزوین', img: null, alt: '', price: null }
  ];

  /* گالری — ترکیب‌بندی ویرایشی (spans: 7/5/4/3/12) */
  var gallery = [
    { src: 'assets/images/hero-kebab.jpg', alt: 'دیس کامل کباب با شش سیخ، سبزی، گوجه و فلفل گریل‌شده', caption: 'سیخ‌ها و مخلفات، آماده‌ی سفره', span: 'g-7' },
    { src: 'assets/images/dish-chenge.jpg', alt: 'دو سیخ کباب روی کاسه‌ی سفید با زیتون و سبزی', caption: 'دو سیخ، یک کاسه‌ی سبزی', span: 'g-5' },
    { src: 'assets/images/dish-estokhan.jpg', alt: 'ساق جوجه‌ی برشته کنار تفت با کنجد', caption: 'جوجه بر فرازِ تفت', span: 'g-4' },
    { src: 'assets/images/dish-torsh.jpg', alt: 'سیخ کباب با ذرتِ گریل‌شده و گوجه', caption: 'ذرت، گوجه و سیخ', span: 'g-4' },
    { src: 'assets/images/signature-plate.jpg', alt: 'سیخ‌های کباب زعفرانی روی کاسه با ذرت و فلفل', caption: 'سیخِ زعفرانی و برنج ذرتی', span: 'g-4' },
    { src: 'assets/images/dish-koo-bideh.jpg', alt: 'کباب کوبیده با گوجه‌ی گریل‌شده در ظرف سفارش', caption: 'کوبیده و گوجه‌ی گریل‌شده', span: 'g-3' },
    { src: 'assets/images/dish-koo-bideh-mormali.jpg', alt: 'سیخ کباب با تکه‌های سیب‌زمینیِ تنوری', caption: 'سیخ و سیب‌زمینیِ تنوری', span: 'g-5' },
    { src: 'assets/images/catering-trays.jpg', alt: 'سه دیس کامل کباب آماده برای مهمانی', caption: 'آماده‌ی هر مهمانی', span: 'g-4' },
    { src: 'assets/images/storefront.jpg', alt: 'روبروی رستوران مزه کباب با تابلو در قزوین', caption: 'روبروی رستوران در ملاصدرا', span: 'g-12' }
  ];

  window.MZKB = { restaurant: restaurant, categories: categories, dishes: dishes, gallery: gallery };
})();
