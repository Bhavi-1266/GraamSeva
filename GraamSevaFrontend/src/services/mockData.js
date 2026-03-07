/**
 * Mock Data - Fallback when APIs are unavailable
 * All data structures match API response format
 */

export const MOCK_SCHEMES = [
{
  id: 1,
  name: "PM-KISAN",
  icon: "🌾",
  desc: "किसान सम्मान निधि योजना",
  details: "₹6000 annual income support",

  governmentLevel: "Central Government",

  eligibility: {
    gender: "All",
    maritalStatus: "All",
    incomeLimit: "₹10 lakh/year",
    landRequired: "≤ 2 hectares",
  },

  benefits: [
    "₹2000 every 4 months",
    "Direct DBT transfer",
    "No middlemen"
  ],

  howToApply: [
    "Visit CSC center",
    "Submit Aadhaar + land records",
    "Verification by district office",
    "Money credited to bank"
  ],

  documents: [
    "Aadhaar card",
    "Land ownership papers",
    "Bank account",
    "Mobile number"
  ],

  authority: {
    ministry: "Ministry of Agriculture",
    stateBody: "State Agriculture Department",
    localBody: "Gram Panchayat"
  }
},
{
  id: 2,
  name: "PM Fasal Bima Yojana",
  icon: "🛡️",
  desc: "प्रधानमंत्री फसल बीमा योजना",
  details: "Crop insurance protection for farmers against natural disasters",

  governmentLevel: "Central + State Government",

  eligibility: {
    gender: "All",
    maritalStatus: "All",
    incomeLimit: "No income limit",
    landRequired: "Must own or cultivate farmland",
  },

  benefits: [
    "Insurance coverage against crop failure",
    "Low premium (1.5%–2% of crop value)",
    "Protection from floods, drought, pests",
    "Direct claim settlement to bank account"
  ],

  howToApply: [
    "Visit nearest bank or CSC center",
    "Register your crop details",
    "Pay small insurance premium",
    "Submit land and Aadhaar documents",
    "Receive insurance coverage confirmation"
  ],

  documents: [
    "Aadhaar card",
    "Land ownership / lease documents",
    "Bank account details",
    "Crop sowing declaration"
  ],

  authority: {
    ministry: "Ministry of Agriculture & Farmers Welfare",
    stateBody: "State Agriculture Insurance Office",
    localBody: "District Agriculture Officer"
  }
},
]

export const MOCK_ELIGIBILITY = {
  1: {
    schemeId: 1,
    title: 'PM-KISAN - किसान सम्मान निधि योजना',
    description: 'खेती में लगे सभी भारतीय किसानों के लिए आर्थिक सहायता योजना',
    requirements: [
      { item: 'भारतीय नागरिक होना चाहिए', status: 'verified' },
      { item: 'खेती योग्य जमीन होनी चाहिए', status: 'verified' },
      { item: '2 हेक्टेयर तक की जमीन', status: 'verified' },
      { item: 'आधार निर्भर बैंक खाता', status: 'pending' },
    ],
    documents: ['आधार कार्ड', 'जमीन के कागजात', 'बैंक खाते की जानकारी', 'मोबाइल नंबर'],
    nextSteps: 'फॉर्म भरने के बाद 30 दिन में ₹2,000 खाते में आएंगे',
  },
}

export const MOCK_DASHBOARD_STATS = {
  todaysCalls: 247,
  applicationsProcessed: 1340,
  amountUnlocked: '₹68,50,000',
  approvalRate: '87%',
  recentActivities: [
    {
      id: 1,
      name: 'राम कुमार',
      scheme: 'PM-KISAN',
      status: 'Approved',
      date: '2 घंटे पहले',
      amount: '₹2,000',
    },
    {
      id: 2,
      name: 'रीता देवी',
      scheme: 'Crop Insurance',
      status: 'Processing',
      date: '4 घंटे पहले',
      amount: '₹15,000',
    },
  ],
  languageBreakdown: [
    { lang: 'हिन्दी', calls: 1200 },
    { lang: 'भोजपुरी', calls: 850 },
    { lang: 'अवधी', calls: 650 },
    { lang: 'ओडिया', calls: 520 },
    { lang: 'मराठी', calls: 420 },
  ],
}

export const MOCK_TRANSCRIPTS = {
  hi: 'मुझे PM-KISAN योजना के बारे में जानकारी चाहिए',
  bhoj: 'हम फसल बीमा के लिए आवेदन करना चाहते हैं',
  awa: 'मिट्टी स्वास्थ्य कार्ड योजना की जानकारी दीजिए',
  odi: 'ମୁଁ MGNREGA ରେଜିଷ୍ଟ୍ରେସନ ସମ୍ପର୍କରେ ଜାଣିବାକୁ ଚାହୁଁ',
  mar: 'मला सरकारी योजनांचा माहिती हवा',
  mai: 'हम PMAW योजनाकेँ बारेमे जानकारी चाहै छी',
  en: 'I need information about government schemes',
}

export const MOCK_APPLICATION_RESPONSE = {
  success: true,
  referenceId: 'GS-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
  status: 'submitted',
  timestamp: new Date().toISOString(),
  expectedApprovalTime: '7-15 days',
  nextSteps: [
    'आपका आवेदन क्षेत्रीय कार्यालय को भेजा जाएगा',
    'अधिकारी आपसे 3-5 दिनों में संपर्क करेंगे',
    'मूल दस्तावेज़ ले जाकर ब्लॉक ऑफिस जाएँ',
    'मंजूरी के बाद 7 दिन में पैसे खाते में आएंगे',
  ],
}

export const MOCK_LATEST_OFFERS = [
  {
    id: 101,
    title: 'नई PM-KISAN वृद्धि',
    desc: '₹ 2000 से बढ़कर ₹ 3000 प्रति माह',
    icon: '📢',
    badge: 'नया',
    date: '2 दिन पहले',
    type: 'update',
  },
  {
    id: 102,
    title: 'फसल बीमा को मिला विस्तार',
    desc: '10 और राज्यों में उपलब्ध अब',
    icon: '🛡️',
    badge: 'अपडेट',
    date: '5 दिन पहले',
    type: 'expansion',
  },
  {
    id: 103,
    title: 'डिजिटल साक्षरता योजना',
    desc: '₹ 500 की छात्रवृत्ति आवेदन के लिए खुली',
    icon: '💻',
    badge: 'नया',
    date: 'आज',
    type: 'new',
  },
  {
    id: 104,
    title: 'बेरोजगारी भत्ता बढ़ाया गया',
    desc: '₹ 500 से ₹ 750 में संशोधन',
    icon: '💰',
    badge: 'अपडेट',
    date: '1 दिन पहले',
    type: 'update',
  },
  {
    id: 105,
    title: 'महिला उद्यम योजना',
    desc: 'महिला किसानों के लिए विशेष ₹ 5 लाख तक ऋण',
    icon: '👩‍🌾',
    badge: 'नया',
    date: '3 दिन पहले',
    type: 'new',
  },
]

export const MOCK_MANDI_PRICES = [
  {
    id: 1,
    mandi: 'रामपुर मंडी',
    state: 'उत्तर प्रदेश',
    crops: [
      {
        crop: 'गेहूं (Wheat)',
        price: '₹2,150/क्विंटल',
        change: '+50',
        trend: 'up',
      },
      {
        crop: 'धान (Paddy)',
        price: '₹1,930/क्विंटल',
        change: '-10',
        trend: 'down',
      },
      {
        crop: 'मक्का (Maize)',
        price: '₹1,700/क्विंटल',
        change: '+20',
        trend: 'up',
      },
    ],
  },

  {
    id: 2,
    mandi: 'लखनऊ मंडी',
    state: 'उत्तर प्रदेश',
    crops: [
      {
        crop: 'गेहूं (Wheat)',
        price: '₹2,180/क्विंटल',
        change: '+30',
        trend: 'up',
      },
      {
        crop: 'दलहन (Pulses)',
        price: '₹5,820/क्विंटल',
        change: '+110',
        trend: 'up',
      },
      {
        crop: 'चना (Gram)',
        price: '₹5,100/क्विंटल',
        change: '-40',
        trend: 'down',
      },
    ],
  },

  {
    id: 3,
    mandi: 'सुल्तानपुर मंडी',
    state: 'उत्तर प्रदेश',
    crops: [
      {
        crop: 'धान (Paddy)',
        price: '₹1,950/क्विंटल',
        change: '+15',
        trend: 'up',
      },
      {
        crop: 'सरसों (Mustard)',
        price: '₹5,400/क्विंटल',
        change: '+70',
        trend: 'up',
      },
      {
        crop: 'मक्का (Maize)',
        price: '₹1,690/क्विंटल',
        change: '0',
        trend: 'stable',
      },
    ],
  },

  {
    id: 4,
    mandi: 'फैजाबाद मंडी',
    state: 'उत्तर प्रदेश',
    crops: [
      {
        crop: 'गेहूं (Wheat)',
        price: '₹2,120/क्विंटल',
        change: '-20',
        trend: 'down',
      },
      {
        crop: 'गन्ना (Sugarcane)',
        price: '₹355/क्विंटल',
        change: '+10',
        trend: 'up',
      },
      {
        crop: 'दलहन (Pulses)',
        price: '₹5,760/क्विंटल',
        change: '+60',
        trend: 'up',
      },
    ],
  },

  {
    id: 5,
    mandi: 'बस्ती मंडी',
    state: 'उत्तर प्रदेश',
    crops: [
      {
        crop: 'गन्ना (Sugarcane)',
        price: '₹350/क्विंटल',
        change: '+15',
        trend: 'up',
      },
      {
        crop: 'धान (Paddy)',
        price: '₹1,920/क्विंटल',
        change: '-30',
        trend: 'down',
      },
      {
        crop: 'चना (Gram)',
        price: '₹5,050/क्विंटल',
        change: '+25',
        trend: 'up',
      },
    ],
  },
]

export const MOCK_LOAN_OPTIONS = [
  {
    id: 1,
    title: 'कृषि उपकरण लोन (Equipment Loan)',
    detail: 'ट्रैक्टर, थ्रेशर और अन्य उपकरण के लिए | 3-7 साल के लिए | 7-9% वार्षिक ब्याज',
    amount: '₹3-10 लाख',
    interest: '7-9%',
    tenure: '3-7 years',
    eligibility: 'खेती योग्य जमीन आवश्यक',
  },
  {
    id: 2,
    title: 'फसल लोन (Crop Loan)',
    detail: 'बीज, खाद, कीटनाशक के लिए अल्पकालिक ऋण | 6-12 महीने | 4-7% ब्याज',
    amount: '₹50,000-5 लाख',
    interest: '4-7%',
    tenure: '6-12 months',
    eligibility: 'खेती का प्रमाण पत्र चाहिए',
  },
  {
    id: 3,
    title: 'पशुपालन लोन (Dairy/Livestock Loan)',
    detail: 'गाय, भैंस, मुर्गी पालन के लिए | 3-5 साल | 8-10% ब्याज',
    amount: '₹1-5 लाख',
    interest: '8-10%',
    tenure: '3-5 years',
    eligibility: 'पशुपालन प्रशिक्षण या अनुभव',
  },
  {
    id: 4,
    title: 'भूमि विकास लोन (Land Development)',
    detail: 'सिंचाई, बोरवेल, तालाब खुदाई के लिए | 5-10 साल | 9-11% ब्याज',
    amount: '₹2-8 लाख',
    interest: '9-11%',
    tenure: '5-10 years',
    eligibility: 'ज़मीन का स्वामित्व आवश्यक',
  },
  {
    id: 5,
    title: 'मुद्रा लोन (MUDRA Loan)',
    detail: 'छोटे व्यवसाय शुरू करने के लिए | 3-5 साल | 8-12% ब्याज',
    amount: '₹50,000-10 लाख',
    interest: '8-12%',
    tenure: '3-5 years',
    eligibility: 'व्यवसाय योजना आवश्यक',
  },
]



export default {
  MOCK_SCHEMES,
  MOCK_ELIGIBILITY,
  MOCK_DASHBOARD_STATS,
  MOCK_TRANSCRIPTS,
  MOCK_APPLICATION_RESPONSE,
  MOCK_LATEST_OFFERS,
  MOCK_MANDI_PRICES,
  MOCK_LOAN_OPTIONS,
}
