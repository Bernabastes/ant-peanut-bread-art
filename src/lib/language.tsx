import { useEffect, useState, type ReactNode } from "react";
import { LanguageContext, type Language, useLanguage } from "./language-context";

const STORAGE_KEY = "ant-peanut-language";

const amharic: Record<string, string> = {
  Home: "መነሻ",
  Shop: "ሱቅ",
  Contact: "ያግኙን",
  "Contact Us": "ያግኙን",
  Main: "ዋና ምናሌ",
  Mobile: "የሞባይል ምናሌ",
  "Search products": "ምርቶችን ይፈልጉ",
  Instagram: "ኢንስታግራም",
  Cart: "ጋሪ",
  "Shop Now": "አሁን ይግዙ",
  "Close menu": "ምናሌውን ዝጋ",
  "Open menu": "ምናሌውን ክፈት",
  "Check order status": "የትዕዛዝዎን ሁኔታ ይመልከቱ",
  "Rich, creamy peanut butter made with care and packed in jars, ready for your table.":
    "በጥንቃቄ የተዘጋጀ፣ ወፍራምና ክሬሚ የሆነ የኦቾሎኒ ቅቤ፤ በማሰሮ ታሽጎ ለገበታዎ ዝግጁ ነው።",
  "All peanut butter": "ሁሉም የኦቾሎኒ ቅቤ",
  "Your cart": "የግዢ ጋሪዎ",
  "Order status": "የትዕዛዝ ሁኔታ",
  Information: "መረጃ",
  FAQ: "ተደጋጋሚ ጥያቄዎች",
  "Local pickup": "በአቅራቢያ ማንሳት",
  "Refunds & cancellations": "ተመላሽ ክፍያና ስረዛ",
  "Privacy Policy": "የግላዊነት ፖሊሲ",
  "Terms & Conditions": "ውሎችና ሁኔታዎች",
  "Call Anteneh: ": "አንተነህን ይደውሉ፦ ",
  "Around ": "አካባቢ፦ ",
  " (Map)": " (ካርታ)",
  "Contact page →": "የመገናኛ ገጽ →",
  "All rights reserved.": "መብቱ በሕግ የተጠበቀ ነው።",
  "Artisan peanut butter": "በእጅ የተዘጋጀ የኦቾሎኒ ቅቤ",
  "Goodness ": "መልካምነት ",
  You: "እርስዎ",
  "Can Taste.": "የሚቀምሱት።",
  "Rich, creamy peanut butter made with care, packed with goodness, and ready to make every bite special.":
    "በጥንቃቄ የተዘጋጀ፣ መልካምነት የተሞላ ወፍራምና ክሬሚ የኦቾሎኒ ቅቤ፤ እያንዳንዱን ንክሻ ልዩ ለማድረግ ዝግጁ ነው።",
  "Shop Our Peanut Butter": "የኦቾሎኒ ቅቤያችንን ይግዙ",
  Scroll: "ወደ ታች",
  "Scroll down": "ወደ ታች ይሸብልሉ",
  "Made with Care": "በጥንቃቄ የተዘጋጀ",
  "A little care in every jar.": "በእያንዳንዱ ማሰሮ ውስጥ ትንሽ ጥንቃቄ።",
  "Rich Peanut Flavor": "የኦቾሎኒ የበለጸገ ጣዕም",
  "A pantry favorite for toast, snacks, and more.": "ለዳቦ፣ ለመክሰስና ለሌሎችም የሚወደድ ምግብ።",
  "Carefully Packed": "በጥንቃቄ የታሸገ",
  "Sealed in jars, ready to enjoy.": "በማሰሮ ታሽጎ ለመደሰት ዝግጁ ነው።",
  "Easy Local Ordering": "ቀላል የአካባቢ ትዕዛዝ",
  "Order online, pay in person.": "በመስመር ላይ ይዘዙ፣ በአካል ይክፈሉ።",
  "Your New Pantry Favorite.": "አዲሱ የምግብ ቤትዎ ተወዳጅ።",
  "Meet the peanut butter that makes simple moments taste better.":
    "ቀላል ጊዜያትን የበለጠ ጣፋጭ የሚያደርገውን የኦቾሎኒ ቅቤ ይወቁ።",
  "View all": "ሁሉንም ይመልከቱ",
  "Simple Ingredients. Unforgettable Flavor.": "ቀላል ግብዓቶች። የማይረሳ ጣዕም።",
  "Discover Our Story": "ታሪካችንን ይወቁ",
  "Made for the Moments You Love.": "ለሚወዷቸው ጊዜያት የተዘጋጀ።",
  "On warm toast in the morning, swirled into oats, or straight from the spoon.":
    "ጠዋት በሞቀ ዳቦ ላይ፣ ከአጃ ጋር ቀላቅለው፣ ወይም በማንኪያ ብቻ።",
  "How to Order": "እንዴት ማዘዝ ይቻላል",
  "Choose Your Favorite": "የሚወዱትን ይምረጡ",
  "Explore the available peanut butter jars and sizes.": "ያሉትን የኦቾሎኒ ቅቤ ማሰሮዎችና መጠኖች ይመልከቱ።",
  "Place Your Order": "ትዕዛዝዎን ያስገቡ",
  "Add products to your cart and enter your contact details.": "ምርቶችን ወደ ጋሪዎ ያክሉና የመገኛ መረጃዎን ያስገቡ።",
  "Collect your order and pay in person.": "ትዕዛዝዎን ይውሰዱና በአካል ይክፈሉ።",
  "What Our Customers Say": "ደንበኞቻችን ምን ይላሉ",
  "I found the peanut butter absolutely delicious. It has a wonderful taste, and to me it was just perfect—such a lovely peanut butter to enjoy.":
    "የኦቾሎኒ ቅቤው በጣም ጣፋጭ ነበር። ድንቅ ጣዕም አለው፣ ለእኔም ፍጹም ነበር፤ ለመደሰት የሚያስደስት የኦቾሎኒ ቅቤ ነው።",
  "This peanut butter was a real delight. The flavor was delicious, and I thought it was perfect in every way for my taste.":
    "ይህ የኦቾሎኒ ቅቤ በእውነት ደስ የሚል ነበር። ጣዕሙ ጣፋጭ ነበር፣ ለእኔም በሁሉም ነገር ፍጹም ሆኖ ተሰማኝ።",
  "Spread a Little Happiness.": "ትንሽ ደስታን ያስፋፉ።",
  "Your next favorite jar is just a few clicks away.": "ቀጣዩ ተወዳጅ ማሰሮዎ ጥቂት ጠቅታዎች ብቻ ይርቃል።",
  "The Shop": "ሱቁ",
  "Creamy peanut butter in a 500 g jar. Pay in person when you collect it.":
    "በ500 ግራም ማሰሮ የታሸገ ክሬሚ የኦቾሎኒ ቅቤ። ሲወስዱት በአካል ይክፈሉ።",
  All: "ሁሉም",
  "Any size": "ማንኛውም መጠን",
  "Any texture": "ማንኛውም ዓይነት",
  "Search…": "ፈልግ…",
  Sort: "ደርድር",
  Name: "ስም",
  "Price: low to high": "ዋጋ፦ ከዝቅተኛ ወደ ከፍተኛ",
  "Price: high to low": "ዋጋ፦ ከከፍተኛ ወደ ዝቅተኛ",
  "No products match your search.": "ከፍለጋዎ ጋር የሚዛመድ ምርት የለም።",
  "Quick view": "ፈጣን እይታ",
  "In stock": "በክምችት አለ",
  "Out of stock": "ከክምችት ውጭ ነው",
  "Only ": "ቀሪው ",
  " left": " ነው",
  "Add to cart": "ወደ ጋሪ ጨምር",
  "Add to Cart": "ወደ ጋሪ ጨምር",
  "Full details": "ሙሉ ዝርዝር",
  "Jar size": "የማሰሮ መጠን",
  "Product not found": "ምርቱ አልተገኘም",
  "Back to shop": "ወደ ሱቅ ተመለስ",
  "To be provided by Ant Peanut.": "በአንት ፒነት የሚቀርብ።",
  Ingredients: "ግብዓቶች",
  Allergens: "አለርጂ አስነሺ ንጥረ ነገሮች",
  Storage: "አከመቻቸት",
  "Your cart is empty": "የግዢ ጋሪዎ ባዶ ነው",
  "Let's find you a jar of something delicious.": "ጣፋጭ ነገር የያዘ ማሰሮ እንፈልግልዎ።",
  "Start shopping": "ግዢ ይጀምሩ",
  "Your Cart": "የግዢ ጋሪዎ",
  "No longer available — please remove.": "ከእንግዲህ አይገኝም — እባክዎ ያስወግዱት።",
  "left.": "ቀርቷል።",
  Decrease: "ቀንስ",
  Increase: "ጨምር",
  " each": " እያንዳንዱ",
  "Remove ": "አስወግድ ",
  "← Continue shopping": "← ግዢውን ይቀጥሉ",
  Summary: "ማጠቃለያ",
  Subtotal: "ንዑስ ድምር",
  Fulfilment: "የማስረከቢያ ዘዴ",
  "Local pickup · No fee": "በአቅራቢያ ማንሳት · ክፍያ የለም",
  "Pay in person when you collect your order.": "ትዕዛዝዎን ሲወስዱ በአካል ይክፈሉ።",
  "Fix cart to continue": "ለመቀጠል ጋሪውን ያስተካክሉ",
  "Proceed to checkout": "ወደ ክፍያ ይቀጥሉ",
  Checkout: "ክፍያ",
  "Go to shop": "ወደ ሱቅ ይሂዱ",
  "Your details": "የእርስዎ መረጃ",
  "Full name *": "ሙሉ ስም *",
  "Phone number *": "ስልክ ቁጥር *",
  "Email (optional)": "ኢሜይል (አማራጭ)",
  "Pickup location will be shared when we confirm your order.":
    "ትዕዛዝዎን ስናረጋግጥ የማንሻ ቦታውን እናሳውቅዎታለን።",
  "Note (optional)": "ማስታወሻ (አማራጭ)",
  Payment: "ክፍያ",
  "Pay in Person": "በአካል ይክፈሉ",
  "Place your order online and pay when you collect it.": "በመስመር ላይ ይዘዙና ሲወስዱት ይክፈሉ።",
  "Order summary": "የትዕዛዝ ማጠቃለያ",
  "No fee": "ክፍያ የለም",
  "Total due": "የሚከፈለው ጠቅላላ",
  "A jar in your cart is unavailable or there isn't enough left. Update the cart before placing the order.":
    "በጋሪዎ ያለ ማሰሮ አይገኝም ወይም በቂ ክምችት የለም። ትዕዛዝ ከማስገባትዎ በፊት ጋሪውን ያስተካክሉ።",
  "Local pickup is currently unavailable. Please contact us before placing an order.":
    "በአቅራቢያ ማንሳት በአሁኑ ጊዜ አይቻልም። ትዕዛዝ ከማስገባትዎ በፊት እባክዎ ያግኙን።",
  "Placing order…": "ትዕዛዝ በማስገባት ላይ…",
  "Place My Order": "ትዕዛዜን አስገባ",
  "Please enter your name and phone number.": "እባክዎ ስምዎንና ስልክ ቁጥርዎን ያስገቡ።",
  "We couldn't save your order. Please try again.": "ትዕዛዝዎን ማስቀመጥ አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "Check your order": "ትዕዛዝዎን ይመልከቱ",
  "Enter the order number and access code shown after checkout.":
    "ከክፍያ በኋላ የታየውን የትዕዛዝ ቁጥርና የመግቢያ ኮድ ያስገቡ።",
  "Order number": "የትዕዛዝ ቁጥር",
  "Access code": "የመግቢያ ኮድ",
  "Saved automatically on this device": "በዚህ መሣሪያ ላይ በራስ-ሰር ተቀምጧል",
  "Checking…": "በመፈተሽ ላይ…",
  "Check status": "ሁኔታውን ይመልከቱ",
  "We couldn't check your order right now. Please try again.":
    "በአሁኑ ጊዜ ትዕዛዝዎን ማረጋገጥ አልቻልንም። እባክዎ እንደገና ይሞክሩ።",
  "We couldn't find an order with those details.": "በዚያ መረጃ የተመዘገበ ትዕዛዝ አላገኘንም።",
  "Loading your order…": "ትዕዛዝዎ በመጫን ላይ…",
  "Unable to load your order": "ትዕዛዝዎን መጫን አልተቻለም",
  "Order not found": "ትዕዛዙ አልተገኘም",
  "Please try again in a moment.": "እባክዎ ከጥቂት ጊዜ በኋላ እንደገና ይሞክሩ።",
  "Look up an order": "ትዕዛዝ ይፈልጉ",
  "Thank you, ": "እናመሰግናለን፣ ",
  "Your order has been received. We'll contact you to confirm. ": "ትዕዛዝዎ ደርሶናል። ለማረጋገጥ እናገኝዎታለን። ",
  "Please pay in person when your order is delivered.": "ትዕዛዝዎ ሲደርስ እባክዎ በአካል ይክፈሉ።",
  "Please pay in person when you collect it.": "ትዕዛዝዎን ሲወስዱ እባክዎ በአካል ይክፈሉ።",
  "Save this to check your order later — order number ": "ትዕዛዝዎን በኋላ ለመከታተል ይህን ያስቀምጡ — የትዕዛዝ ቁጥር ",
  " and access code ": " እና የመግቢያ ኮድ ",
  "Continue shopping": "ግዢውን ይቀጥሉ",
  Status: "ሁኔታ",
  Pickup: "ማንሳት",
  Delivery: "ማድረስ",
  "Amount due": "የሚከፈለው መጠን",
  "Owner sign in": "የባለቤት መግቢያ",
  Email: "ኢሜይል",
  Password: "የማለፊያ ቃል",
  "Sign in": "ግባ",
  Overview: "አጠቃላይ እይታ",
  Products: "ምርቶች",
  Settings: "ቅንብሮች",
  "Unable to verify admin access": "የአስተዳዳሪ መዳረሻን ማረጋገጥ አልተቻለም",
  "No admin access": "የአስተዳዳሪ መዳረሻ የለም",
  "Sign out": "ውጣ",
  "View store": "ሱቁን ይመልከቱ",
  "Total orders": "ጠቅላላ ትዕዛዞች",
  Pending: "በመጠባበቅ ላይ",
  Confirmed: "የተረጋገጠ",
  Preparing: "በዝግጅት ላይ",
  "Ready / out": "ዝግጁ / ተልኳል",
  Completed: "ተጠናቋል",
  "Unpaid (active)": "ያልተከፈለ (ንቁ)",
  "Order value": "የትዕዛዝ ዋጋ",
  "Recent orders": "የቅርብ ጊዜ ትዕዛዞች",
  "No orders yet.": "እስካሁን ትዕዛዝ የለም።",
  "Manage all orders →": "ሁሉንም ትዕዛዞች ያስተዳድሩ →",
  Published: "ታትሟል",
  Hidden: "ተደብቋል",
  Featured: "ተመራጭ",
  Edit: "አርትዕ",
  "New product": "አዲስ ምርት",
  "Sample prices already in the catalog are placeholders. Set your real prices, stock, and jar photos before you take orders.":
    "በካታሎጉ ያሉት የናሙና ዋጋዎች ጊዜያዊ ናቸው። ትዕዛዝ ከመቀበልዎ በፊት ትክክለኛ ዋጋ፣ ክምችትና የማሰሮ ፎቶዎችን ያስገቡ።",
  "Short description": "አጭር መግለጫ",
  Description: "መግለጫ",
  Texture: "ይዘት",
  Category: "ምድብ",
  None: "የለም",
  "Or add a category": "ወይም ምድብ ያክሉ",
  "Optional new category name": "አዲስ ምድብ ስም (አማራጭ)",
  "Only what you actually use": "በእርግጥ የሚጠቀሙትን ብቻ",
  "Only verified allergen information": "የተረጋገጠ የአለርጂ መረጃ ብቻ",
  Photo: "ፎቶ",
  "Illustrations are placeholders. Upload a photo of your real jar when you have one.":
    "ስዕሎቹ ጊዜያዊ ምስሎች ናቸው። ሲኖርዎት የእውነተኛውን ማሰሮ ፎቶ ይጫኑ።",
  Orders: "ትዕዛዞች",
  "Order #, name or phone": "የትዕዛዝ ቁጥር፣ ስም ወይም ስልክ",
  "All statuses": "ሁሉም ሁኔታዎች",
  "Any payment": "ማንኛውም ክፍያ",
  Unpaid: "ያልተከፈለ",
  Paid: "ተከፍሏል",
  Date: "ቀን",
  "No orders found.": "ትዕዛዝ አልተገኘም።",
  "Fulfilment:": "የማስረከቢያ ዘዴ፦",
  "Home delivery": "ወደ ቤት ማድረስ",
  "Address:": "አድራሻ፦",
  "Instructions:": "መመሪያዎች፦",
  "Customer note:": "የደንበኛ ማስታወሻ፦",
  "Total ": "ጠቅላላ ",
  "Mark as unpaid": "እንዳልተከፈለ ምልክት አድርግ",
  "Mark payment received": "ክፍያ መድረሱን ምልክት አድርግ",
  "Internal notes": "የውስጥ ማስታወሻዎች",
  "Save notes": "ማስታወሻዎችን አስቀምጥ",
  "Business name": "የንግድ ስም",
  "Announcement bar": "የማስታወቂያ ክፍል",
  "Currency code": "የገንዘብ አይነት ኮድ",
  Country: "አገር",
  Phone: "ስልክ",
  Address: "አድራሻ",
  "Instagram URL": "የኢንስታግራም አድራሻ",
  "Pickup instructions": "የማንሻ መመሪያዎች",
  "These details appear on the store. Update the phone, location, and story here whenever they change.":
    "እነዚህ ዝርዝሮች በሱቁ ላይ ይታያሉ። ሲቀየሩ ስልኩን፣ ቦታውንና ታሪኩን እዚህ ያዘምኑ።",
  "Our story": "የእኛ ታሪክ",
  "Saving…": "በማስቀመጥ ላይ…",
  "Save settings": "ቅንብሮችን አስቀምጥ",
  "Draft — the business owner must review and finalise this page before launch.":
    "ረቂቅ — ከመጀመሩ በፊት የንግዱ ባለቤት ይህን ገጽ መገምገምና ማጠናቀቅ አለበት።",
  "Frequently Asked Questions": "ተደጋጋሚ ጥያቄዎች",
  "How do I pay?": "እንዴት እከፍላለሁ?",
  "You pay in person when you collect your order. We never ask for card details online.":
    "ትዕዛዝዎን ሲወስዱ በአካል ይከፍላሉ። በመስመር ላይ የካርድ መረጃ በፍጹም አንጠይቅም።",
  "How do I know my order was received?": "ትዕዛዜ መድረሱን እንዴት አውቃለሁ?",
  "After checkout you get an order number and access code. Use them on the Order Status page.":
    "ክፍያ ከጨረሱ በኋላ የትዕዛዝ ቁጥርና የመግቢያ ኮድ ይቀበላሉ። በትዕዛዝ ሁኔታ ገጽ ላይ ይጠቀሙባቸው።",
  "Where can I get my order?": "ትዕዛዜን የት ማግኘት እችላለሁ?",
  "Orders are available for local pickup. We will confirm the pickup details with you.":
    "ትዕዛዞችን በአቅራቢያ ማንሳት ይቻላል። የማንሻ ዝርዝሮችን እናረጋግጥልዎታለን።",
  "What are the ingredients?": "ግብዓቶቹ ምንድን ናቸው?",
  "Ingredients and allergen details are listed on each product page.":
    "የግብዓቶችና የአለርጂ መረጃ በእያንዳንዱ የምርት ገጽ ላይ ተዘርዝሯል።",
  "Local Pickup": "በአቅራቢያ ማንሳት",
  "Pickup location": "የማንሻ ቦታ",
  "Pickup location is shared when we confirm your order.": "ትዕዛዝዎን ስናረጋግጥ የማንሻ ቦታውን እናሳውቅዎታለን።",
  "Pickup Location": "የማንሻ ቦታ",
  "Ant Peanut · Jemo": "አንት ፒነት · ጅሞ",
  "Open in Google Maps": "በጉግል ካርታ ክፈት",
  "Pickup location in Jemo. Show pickup details.": "በጅሞ የማንሻ ቦታ። የማንሻ ዝርዝሮችን አሳይ።",
  "Pick up your fresh jar here in Jemo! 🥜": "ትኩስ ማሰሮዎን እዚህ ጅሞ ይውሰዱ! 🥜",
  "Call Anteneh: +251 92 313 9185": "አንተነህን ይደውሉ፦ +251 92 313 9185",
  "We would love to hear from you.": "ከእርስዎ መስማት ደስ ይለናል።",
  "Call Anteneh:": "አንተነህን ይደውሉ፦",
  "Location:": "ቦታ፦",
  "(Open map)": "(ካርታ ክፈት)",
  "Map showing Jemo, Addis Ababa": "ጅሞ፣ አዲስ አበባን የሚያሳይ ካርታ",
  "We collect only the details needed to fulfil your order: your name, phone number, optional email, and any information needed to arrange local pickup.":
    "ትዕዛዝዎን ለማሟላት የሚያስፈልገንን መረጃ ብቻ እንሰበስባለን፦ ስምዎን፣ ስልክ ቁጥርዎን፣ አማራጭ ኢሜይልዎንና የአካባቢ ማንሻን ለማዘጋጀት የሚያስፈልግ መረጃ።",
  "We use this information to confirm and prepare your order, arrange local pickup, and contact you about it. We do not sell your information.":
    "ይህን መረጃ ትዕዛዝዎን ለማረጋገጥና ለማዘጋጀት፣ የአካባቢ ማንሳትን ለማቀናጀትና ስለ ትዕዛዝዎ ለማግኘት እንጠቀማለን። መረጃዎን አንሸጥም።",
  "To ask about or delete your data, contact us using the details on the Contact page.":
    "ስለ መረጃዎ ለመጠየቅ ወይም ለማጥፋት በመገናኛ ገጹ ላይ ባለው መረጃ ያግኙን።",
  "Refunds and Cancellations": "ተመላሽ ክፍያና ስረዛዎች",
  "Before the order is prepared": "ትዕዛዙ ከመዘጋጀቱ በፊት",
  "After payment in person": "በአካል ከከፈሉ በኋላ",
  "Food products": "የምግብ ምርቶች",
  "Terms and Conditions": "ውሎችና ሁኔታዎች",
  "Cancellations and refunds": "ስረዛዎችና ተመላሽ ክፍያዎች",
  "This page doesn't exist or has been moved.": "ይህ ገጽ የለም ወይም ተንቀሳቅሷል።",
  "Page not found": "ገጹ አልተገኘም",
  "Go home": "ወደ መነሻ ይሂዱ",
  "This page didn't load": "ይህ ገጽ አልተጫነም",
  "Something went wrong. Try refreshing or head back home.":
    "ችግር ተፈጥሯል። ገጹን እንደገና ይጫኑ ወይም ወደ መነሻ ይመለሱ።",
  "Try again": "እንደገና ይሞክሩ",
  "Pending Confirmation": "ማረጋገጫ በመጠባበቅ ላይ",
  "Ready for Pickup": "ለማንሳት ዝግጁ",
  "Out for Delivery": "ለማድረስ ተልኳል",
  Cancelled: "ተሰርዟል",
  Rejected: "ውድቅ ተደርጓል",
  "Our Story": "የእኛ ታሪክ",
  Slug: "የድረ-ገጽ አጭር ስም",
  "Available in the shop": "በሱቁ ውስጥ ይገኛል",
  "Feature on the homepage": "በመነሻ ገጽ ላይ ያሳዩ",
  "Jar sizes — prices in ": "የማሰሮ መጠኖች — ዋጋዎች በ ",
  Size: "መጠን",
  Price: "ዋጋ",
  Stock: "ክምችት",
  "On sale": "በሽያጭ ላይ",
  "Save product": "ምርቱን አስቀምጥ",
  Close: "ዝጋ",
  Delete: "ሰርዝ",
  "Photo uploaded": "ፎቶው ተጭኗል",
  "Enter a product name.": "የምርት ስም ያስገቡ።",
  "Enter a web address slug.": "የድረ-ገጽ አጭር ስም ያስገቡ።",
  "Every jar size needs a label, a price, and a stock quantity of zero or more.":
    "ለእያንዳንዱ የማሰሮ መጠን መለያ፣ ዋጋና ዜሮ ወይም ከዚያ በላይ የክምችት ብዛት ያስፈልጋል።",
  "Could not add the category.": "ምድቡን ማከል አልተቻለም።",
  "Could not save the product.": "ምርቱን ማስቀመጥ አልተቻለም።",
  "Product saved": "ምርቱ ተቀምጧል",
  "Product deleted": "ምርቱ ተሰርዟል",
  "View cart": "ጋሪውን ይመልከቱ",
  "Settings saved": "ቅንብሮች ተቀምጠዋል",
  "Settings saved. Instagram needs the SQL in drizzle/migrations/0001_admin_extras.sql.":
    "ቅንብሮች ተቀምጠዋል። ኢንስታግራምን ለማንቃት በdrizzle/migrations/0001_admin_extras.sql ያለው SQL ያስፈልጋል።",
  "Delete ": "ሰርዝ ",
  "? Past orders keep their item names.": "? ቀደም ያሉ ትዕዛዞች የምርት ስሞቻቸውን ይጠብቃሉ።",
  "Order updated": "ትዕዛዙ ተዘምኗል",
  "This draft explains how ": "ይህ ረቂቅ የሚያብራራው ",
  " handles changes to an order. Replace it with the policy you actually follow before launch.":
    " በትዕዛዝ ላይ ያሉ ለውጦችን እንዴት እንደሚያስተናግድ ነው። ከመጀመሩ በፊት በእርግጥ በሚከተሉት ፖሊሲ ይተኩት።",
  "Contact us with your order number if you need to cancel or change a jar size. We can cancel an order that is still waiting for confirmation.":
    "ትዕዛዝ ለመሰረዝ ወይም የማሰሮ መጠን ለመቀየር ከፈለጉ የትዕዛዝ ቁጥርዎን ይዘው ያግኙን። ማረጋገጫ የሚጠብቅ ትዕዛዝ መሰረዝ እንችላለን።",
  "Payment is collected when the order is picked up. If a jar is damaged when you collect it, contact us the same day so we can decide on a replacement or refund.":
    "ትዕዛዙ ሲነሳ ክፍያ ይፈጸማል። ሲወስዱት ማሰሮው ከተጎዳ፣ ምትክ ወይም ተመላሽ ክፍያ ለመወሰን በዚያው ቀን ያግኙን።",
  "Opened jars cannot be returned. This page does not promise a refund that the business has not agreed to.":
    "የተከፈቱ ማሰሮዎች ተመላሽ አይደረጉም። ንግዱ ያልተስማማበትን ተመላሽ ክፍያ ይህ ገጽ አያረጋግጥም።",
  "Orders placed online are requests until confirmed by ":
    "በመስመር ላይ የሚገቡ ትዕዛዞች እስኪረጋገጡ ድረስ ጥያቄዎች ናቸው፤ ",
  "Prices are shown in": "ዋጋዎች የሚታዩት በ",
  ". Prices are shown in": "። ዋጋዎች የሚታዩት በ",
  ". Orders are collected locally, with payment made in person at pickup.":
    "። ትዕዛዞች በአካባቢ ይነሳሉ፣ ክፍያውም ትዕዛዙን ሲወስዱ በአካል ይፈጸማል።",
  "You may cancel before your order is prepared by contacting us. Refund terms for food products will be confirmed by the owner.":
    "ከትዕዛዝዎ ዝግጅት በፊት እኛን በማግኘት መሰረዝ ይችላሉ። ለምግብ ምርቶች የተመላሽ ክፍያ ውሎች በባለቤቱ ይረጋገጣሉ።",
  "Email:": "ኢሜይል፦",
  Around: "አካባቢ፦",
  Goodness: "መልካምነት",
  "Thank you,": "እናመሰግናለን፣",
  "Your order has been received. We'll contact you to confirm.": "ትዕዛዝዎ ደርሶናል። ለማረጋገጥ እናገኝዎታለን።",
  "Save this to check your order later — order number": "ትዕዛዝዎን በኋላ ለመከታተል ይህን ያስቀምጡ — የትዕዛዝ ቁጥር",
  "and access code": "እና የመግቢያ ኮድ",
  "← Shop": "← ወደ ሱቅ",
  "Local pickup available": "በአቅራቢያ ማንሳት ይቻላል",
  "Pay in person — no card needed.": "በአካል ይክፈሉ — ካርድ አያስፈልግም።",
  "This draft explains how": "ይህ ረቂቅ የሚያብራራው",
  "handles changes to an order. Replace it with the policy you actually follow before launch.":
    "በትዕዛዝ ላይ ያሉ ለውጦችን እንዴት እንደሚያስተናግድ ነው። ከመጀመሩ በፊት በእርግጥ በሚከተሉት ፖሊሲ ይተኩት።",
  "Orders placed online are requests until confirmed by":
    "በመስመር ላይ የሚገቡ ትዕዛዞች እስኪረጋገጡ ድረስ ጥያቄዎች ናቸው፤",
  "Loading…": "በመጫን ላይ…",
  ") —": ") —",
  "· Delivery": "· ማድረስ",
  "Jar sizes — prices in": "የማሰሮ መጠኖች — ዋጋዎች በ",
  Apply: "ይተግብሩ",
  "in the connected Supabase SQL Editor. It sets up the store defaults and grants the first existing account admin access if the store has no administrator yet.":
    "በተገናኘው Supabase SQL Editor ውስጥ። የሱቁን ነባሪ ቅንብሮች ያዘጋጃል፤ ሱቁ አስተዳዳሪ ከሌለውም ለመጀመሪያው ነባር መለያ የአስተዳዳሪ መዳረሻ ይሰጣል።",
  "If another account already has admin access, use that account or ask the project owner to grant this account the admin role in Supabase.":
    "ሌላ መለያ አስቀድሞ የአስተዳዳሪ መዳረሻ ካለው፣ ያንን መለያ ይጠቀሙ ወይም የፕሮጀክቱን ባለቤት በSupabase ውስጥ ለዚህ መለያ የአስተዳዳሪ ሚና እንዲሰጥ ይጠይቁ።",
  "The store couldn't check this account's admin role:": "ሱቁ የዚህን መለያ አስተዳዳሪ ሚና ማረጋገጥ አልቻለም፦",
  " is signed in, but this account isn't an administrator of this store.":
    "ገብተዋል፣ ግን ይህ መለያ የዚህ ሱቅ አስተዳዳሪ አይደለም።",
  "We make our peanut butter at home, using our machine to turn peanuts into a smooth, creamy spread. We keep the recipe simple and pure.":
    "የኦቾሎኒ ቅቤያችንን በቤት ውስጥ እናዘጋጃለን፤ ኦቾሎኒን ለስላሳና ክሬሚ ለማድረግ ማሽናችንን እንጠቀማለን። አሰራሩን ቀላልና ንጹህ እናደርጋለን።",
  "Start with peanuts. Peanuts are the only ingredient in our peanut butter.":
    "በኦቾሎኒ ይጀምሩ። በኦቾሎኒ ቅቤያችን ውስጥ ብቸኛው ግብዓት ኦቾሎኒ ነው።",
  "Add them to the machine. We put the peanuts into our grinding machine.":
    "ወደ ማሽኑ ያስገቡ። ኦቾሎኒዎቹን ወደ መፍጫ ማሽናችን እናስገባለን።",
  "Grind until creamy. The machine grinds the peanuts into the smooth, creamy texture we love.":
    "ክሬሚ እስኪሆን ድረስ ይፍጩ። ማሽኑ ኦቾሎኒዎቹን ወደምንወደው ለስላሳና ክሬሚ ይዘት ይፈጫል።",
  "Keep it pure. We do not add sugar, water, or anything else—just peanuts.":
    "ንጹህ ያድርጉት። ስኳር፣ ውሃ ወይም ሌላ ነገር አንጨምርም — ኦቾሎኒ ብቻ።",
  "From peanut to jar": "ከኦቾሎኒ ወደ ማሰሮ",
  "Peanut Grind Simulator": "የኦቾሎኒ መፍጫ ሙከራ",
  "Hold the button and watch fresh peanuts become creamy Ant Peanut butter.":
    "ቁልፉን ተጭነው ይያዙ፤ ትኩስ ኦቾሎኒ ወደ ክሬሚ አንት ፒነት ቅቤ ሲቀየር ይመልከቱ።",
  "Raw peanuts": "ጥሬ ኦቾሎኒ",
  "The grinder": "መፍጫው",
  "Your jar": "የእርስዎ ማሰሮ",
  "Hold to Grind!": "ለመፍጨት ተጭነው ይያዙ!",
  "Keep Grinding!": "መፍጨቱን ይቀጥሉ!",
  "Grinding… keep holding!": "በመፍጨት ላይ… ተጭነው ይቆዩ!",
  "Keep holding to fill your jar.": "ማሰሮዎን ለመሙላት ተጭነው ይቆዩ።",
  "Jar fill level": "የማሰሮ ሙሌት መጠን",
  "Freshly ground! Ready to order yours?": "አሁን የተፈጨ! የእርስዎን ለማዘዝ ዝግጁ ነዎት?",
  "Shop Peanut Butter": "የኦቾሎኒ ቅቤ ይግዙ",
  "Pack into jars. We put the creamy peanut butter into jars, ready for you to enjoy.":
    "በማሰሮ ያሽጉ። ክሬሚውን የኦቾሎኒ ቅቤ ለእርስዎ ዝግጁ በሆኑ ማሰሮዎች እናስቀምጣለን።",
  "(Map)": "(ካርታ)",
  ". All rights reserved.": "። መብቱ በሕግ የተጠበቀ ነው።",
  Creamy: "ክሬሚ",
  Smooth: "ለስላሳ",
  "Peanut butter being spread on toast": "በዳቦ ላይ የሚቀባ የኦቾሎኒ ቅቤ",
  "A swirl of creamy peanut butter on a wooden spoon": "በእንጨት ማንኪያ ላይ ያለ ክሬሚ የኦቾሎኒ ቅቤ",
  "Illustrated placeholder of an Ant Peanut jar": "የአንት ፒነት ማሰሮ ጊዜያዊ ስዕል",
  "Illustrated placeholder of an Ant Peanut creamy jar. Replace with a photo of the real jar.":
    "የአንት ፒነት ክሬሚ ማሰሮ ጊዜያዊ ስዕል። በእውነተኛው ማሰሮ ፎቶ ይተኩት።",
  "Select language": "ቋንቋ ይምረጡ",
  English: "English",
  አማርኛ: "አማርኛ",
};

const normalizedAmharic = new Map(
  Object.entries(amharic).map(([source, translated]) => [
    source.trim().replace(/\s+/g, " "),
    translated,
  ]),
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "am" || saved === "en") setLanguageState(saved);
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Select language"
      className={`inline-flex shrink-0 items-center rounded-full border bg-background p-0.5 text-xs ${className}`}
    >
      <button
        type="button"
        aria-pressed={language === "en"}
        onClick={() => setLanguage("en")}
        className={`rounded-full px-2 py-1.5 font-medium transition-colors ${language === "en" ? "bg-chocolate text-cream" : "hover:bg-muted"}`}
      >
        English
      </button>
      <button
        type="button"
        aria-pressed={language === "am"}
        onClick={() => setLanguage("am")}
        className={`rounded-full px-2 py-1.5 font-medium transition-colors ${language === "am" ? "bg-chocolate text-cream" : "hover:bg-muted"}`}
      >
        አማርኛ
      </button>
    </div>
  );
}

function translateText(text: string, language: Language) {
  if (language === "en") return text;
  const normalized = text.trim().replace(/\s+/g, " ");
  const translated = normalizedAmharic.get(normalized);
  const cartLabel = normalized.match(/^Cart, (\d+) items?$/);
  const stockLabel = normalized.match(/^Only (\d+) left$/);
  const removeLabel = normalized.match(/^Remove (.+)$/);
  const deleteLabel = normalized.match(/^Delete (.+)\? Past orders keep their item names\.$/);
  const addedLabel = normalized.match(/^(.+) \((.*)\) added to cart$/);
  const numberedAddedLabel = normalized.match(/^(\d+ × .+) added$/);
  const adminRoleError = normalized.match(
    /^The store couldn't check this account's admin role: (.+)$/,
  );
  const notAdmin = normalized.match(
    /^(.+) is signed in, but this account isn't an administrator of this store\.$/,
  );
  const productAlt = normalized.match(
    /^(.+) jar\. Illustrated placeholder until a photograph of the real jar is added\.$/,
  );
  const dynamicTranslation = cartLabel
    ? `ጋሪ፣ ${cartLabel[1]} እቃ`
    : stockLabel
      ? `ቀሪው ${stockLabel[1]} ነው`
      : removeLabel
        ? `አስወግድ ${removeLabel[1]}`
        : deleteLabel
          ? `የ${deleteLabel[1]} ምርትን ሰርዝ? ቀደም ያሉ ትዕዛዞች የምርት ስሞቻቸውን ይጠብቃሉ።`
          : addedLabel
            ? `${addedLabel[1]} (${addedLabel[2]}) ወደ ጋሪ ተጨምሯል`
            : numberedAddedLabel
              ? `${numberedAddedLabel[1]} ተጨምሯል`
              : adminRoleError
                ? `ሱቁ የዚህን መለያ አስተዳዳሪ ሚና ማረጋገጥ አልቻለም፦ ${adminRoleError[1]}`
                : notAdmin
                  ? `${notAdmin[1]} ገብተዋል፣ ግን ይህ መለያ የዚህ ሱቅ አስተዳዳሪ አይደለም።`
                  : productAlt
                    ? `${productAlt[1]} ማሰሮ። እውነተኛውን ማሰሮ ፎቶ እስኪጨመር ድረስ ጊዜያዊ ስዕል።`
                    : undefined;
  if (!translated && !dynamicTranslation) return text;
  const leading = text.match(/^\s*/)?.[0] ?? "";
  const trailing = text.match(/\s*$/)?.[0] ?? "";
  return `${leading}${(translated ?? dynamicTranslation)?.trim()}${trailing}`;
}

const originalText = new WeakMap<Text, { value: string; rendered: string }>();
const originalAttributes = new WeakMap<Element, Map<string, { value: string; rendered: string }>>();

export function LocalizedContent({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  useEffect(() => {
    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node as Text;
        const record = originalText.get(text);
        const value = record && text.data === record.rendered ? record.value : text.data;
        const rendered = translateText(value, language);
        originalText.set(text, { value, rendered });
        if (text.data !== rendered) text.data = rendered;
        return;
      }

      if (!(node instanceof Element) || ["SCRIPT", "STYLE"].includes(node.tagName)) return;
      let attrs = originalAttributes.get(node);
      if (!attrs) {
        attrs = new Map();
        originalAttributes.set(node, attrs);
      }
      for (const attr of ["aria-label", "placeholder", "title", "alt"]) {
        const current = node.getAttribute(attr);
        if (current === null) continue;
        const record = attrs.get(attr);
        const value = record && current === record.rendered ? record.value : current;
        const rendered = translateText(value, language);
        attrs.set(attr, { value, rendered });
        if (current !== rendered) node.setAttribute(attr, rendered);
      }
      for (const child of node.childNodes) processNode(child);
    };

    if (document.body) processNode(document.body);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData") processNode(record.target);
        else if (record.type === "attributes") processNode(record.target);
        else record.addedNodes.forEach(processNode);
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-label", "placeholder", "title", "alt"],
    });
    return () => observer.disconnect();
  }, [language]);

  return <>{children}</>;
}
