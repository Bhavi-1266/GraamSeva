export const TRANSLATIONS = {
  en: {
    appName: 'GraamSeva',
    appTagline: 'Voice-first support for rural citizens.',
    chooseLanguage: 'Choose your language',
    name: 'Name',
    mobile: 'Mobile Number',
    continue: 'Continue',
    back: 'Back',
    greeting: 'Namaste',
    reset: 'Reset',
    invalidProfile: 'Please select language, enter name, and provide a valid 10-digit mobile number.',
    assistantTitle: 'GraamSeva Assistant',
    state: 'State',
    you: 'You',
    ai: 'AI',
    typeQuestion: 'Type your question',
    send: 'Send',
    homeTitle: 'Welcome',
    homeSubtitle: 'Choose a service below or ask the assistant at the top. Voice can redirect you anywhere.',
    noHistory: 'No conversation yet.',
    pages: {
      home: 'Home',
      schemes: 'Schemes',
      mandi: 'Mandi',
      loan: 'Loan',
      apply: 'Apply',
      history: 'History',
    },
  },
  hi: {
    appName: 'ग्रामसेवा',
    appTagline: 'ग्रामीण नागरिकों के लिए वॉइस-फर्स्ट सहायता।',
    chooseLanguage: 'अपनी भाषा चुनें',
    name: 'नाम',
    mobile: 'मोबाइल नंबर',
    continue: 'आगे बढ़ें',
    back: 'वापस',
    greeting: 'नमस्ते',
    reset: 'रीसेट',
    invalidProfile: 'कृपया भाषा चुनें, नाम भरें और सही 10 अंकों का मोबाइल नंबर दर्ज करें।',
    assistantTitle: 'ग्रामसेवा सहायक',
    state: 'स्थिति',
    you: 'आप',
    ai: 'एआई',
    typeQuestion: 'अपना सवाल लिखें',
    send: 'भेजें',
    homeTitle: 'स्वागत है',
    homeSubtitle: 'नीचे सेवा चुनें या ऊपर सहायक से पूछें। वॉइस से सीधे संबंधित पेज पर जा सकते हैं।',
    noHistory: 'अभी कोई बातचीत नहीं है।',
    pages: {
      home: 'होम',
      schemes: 'योजनाएं',
      mandi: 'मंडी',
      loan: 'लोन',
      apply: 'आवेदन',
      history: 'इतिहास',
    },
  },
}

export function getUiLanguage(languageCode, uiLanguageMap) {
  return uiLanguageMap[languageCode] || 'hi'
}

export function getCards(lang) {
  if (lang === 'hi') {
    return {
      schemes: [
        { title: 'पीएम-किसान', detail: 'सीधा लाभ: ₹6,000 प्रति वर्ष' },
        { title: 'कृषि उपकरण सब्सिडी', detail: '40% तक सब्सिडी सहायता' },
        { title: 'किसान क्रेडिट कार्ड', detail: 'फसल व उपकरण लोन ₹3 लाख तक' },
      ],
      mandi: [
        { title: 'सीतापुर मंडी', detail: 'गेहूं: ₹2,320 प्रति क्विंटल' },
        { title: 'हरदोई मंडी', detail: 'गेहूं: ₹2,280 प्रति क्विंटल' },
        { title: 'लखनऊ मंडी', detail: 'गेहूं: ₹2,400 प्रति क्विंटल' },
      ],
    }
  }

  return {
    schemes: [
      { title: 'PM-KISAN', detail: 'Direct support: Rs 6,000/year' },
      { title: 'Farm Equipment Subsidy', detail: 'Up to 40% subsidy support' },
      { title: 'Kisan Credit Card', detail: 'Crop + equipment loan up to Rs 3 lakh' },
    ],
    mandi: [
      { title: 'Sitapur Mandi', detail: 'Wheat: Rs 2,320 / quintal' },
      { title: 'Hardoi Mandi', detail: 'Wheat: Rs 2,280 / quintal' },
      { title: 'Lucknow Mandi', detail: 'Wheat: Rs 2,400 / quintal' },
    ],
  }
}