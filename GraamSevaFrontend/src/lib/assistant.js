import { getLocationLabel } from './location'

const PAGE_KEYWORDS = {
  schemes: ['scheme', 'yojna', 'subsidy', 'tractor', 'योजना', 'सब्सिडी', 'ट्रैक्टर'],
  mandi: ['mandi', 'rate', 'price', 'gehu', 'wheat', 'grain', 'मंडी', 'भाव', 'गेहूं'],
  loan: ['loan', 'credit', 'kcc', 'finance', 'लोन', 'ऋण'],
  apply: ['apply', 'application', 'form', 'register', 'आवेदन', 'फॉर्म'],
}

export function formatTime(ts) {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function detectRedirect(query) {
  const lower = query.toLowerCase()
  return Object.keys(PAGE_KEYWORDS).find((page) =>
    PAGE_KEYWORDS[page].some((keyword) => lower.includes(keyword)),
  )
}

export function createAssistantReply({ query, page, memoryIntent, lang, pageLabels, cards, location }) {
  const lower = query.toLowerCase()
  const redirect = detectRedirect(query)
  const locationLabel = getLocationLabel(location)

  const copy =
    lang === 'hi'
      ? {
          redirectMsg: (p) => `आपको ${p} पेज पर ले जा रहा हूँ।`,
          topSuggestions: ['मुख्य विकल्प दिखाएं', 'वॉइस मोड शुरू करें', 'आवेदन फॉर्म खोलें'],
          subsidy: 'ट्रैक्टर सहायता में सब्सिडी लगभग 30% से 40% तक हो सकती है।',
          subsidySug: ['मेरी पात्रता जांचें', 'ट्रैक्टर योजनाएं खोलें', 'अभी आवेदन करें'],
          schemeTractor: 'आप ट्रैक्टर सब्सिडी और कृषि उपकरण लोन के लिए पात्र हो सकते हैं।',
          schemeTractorSug: ['अभी आवेदन करें', 'लोन पात्रता जांचें', 'नजदीकी सेवा केंद्र देखें'],
          schemeDefault: 'मैं सब्सिडी, फसल बीमा, पीएम-किसान और मनरेगा में मार्गदर्शन दे सकता हूँ।',
          schemeDefaultSug: ['पीएम-किसान जानकारी', 'फसल बीमा सहायता', 'आवेदन प्रक्रिया खोलें'],
          mandiWheat: locationLabel
            ? `${locationLabel} के आसपास गेहूं के मंडी भाव नीचे उपलब्ध हैं।`
            : 'गेहूं के नजदीकी मंडी भाव नीचे उपलब्ध हैं।',
          mandiWheatSug: ['धान का भाव दिखाएं', 'कल का रुझान देखें', 'नजदीकी मंडी खोलें'],
          mandiDefault: locationLabel
            ? `फसल का नाम बताइए, मैं ${locationLabel} के आसपास के बाजार भाव दिखा दूंगा।`
            : 'फसल का नाम बताइए, मैं आपके आसपास के बाजार भाव दिखा दूंगा।',
          mandiDefaultSug: ['गेहूं का भाव', 'धान का भाव', 'मक्का का भाव'],
          loanTractor: 'ट्रैक्टर लोन का अनुमान नीचे तैयार है।',
          loanTractorSug: ['केसीसी विकल्प लें', 'नाबार्ड लोन तुलना', 'आवेदन फॉर्म पर जाएं'],
          loanDefault: 'लोन का उद्देश्य और राशि बताइए, मैं सही सरकारी विकल्प सुझाऊंगा।',
          loanDefaultSug: ['फसल लोन', 'ट्रैक्टर लोन', 'सिंचाई लोन'],
          applyText: 'आप टाइपिंग, वॉइस या कॉल मोड से आवेदन दे सकते हैं।',
          applySug: ['वॉइस से ऑटो-फिल', 'सपोर्ट एजेंट को कॉल', 'आवेदन जमा करें'],
          general: locationLabel
            ? `मैं ${locationLabel} के अनुसार योजनाएं, मंडी भाव, लोन अनुमान और आवेदन सहायता दे सकता हूँ।`
            : 'मैं आपको योजनाएं, मंडी भाव, लोन अनुमान और आवेदन सहायता तक पहुंचा सकता हूँ।',
          generalSug: ['योजनाएं खोलें', 'मंडी भाव देखें', 'आवेदन शुरू करें'],
        }
      : {
          redirectMsg: (p) => `Taking you to ${p}.`,
          topSuggestions: ['Show top options', 'Start voice mode', 'Open application form'],
          subsidy: 'For tractor support, subsidy usually ranges from 30% to 40%.',
          subsidySug: ['Check my eligibility', 'Open tractor schemes', 'Apply now'],
          schemeTractor: 'You may be eligible for tractor subsidy and low-interest farm equipment loan.',
          schemeTractorSug: ['Apply now', 'Check loan eligibility', 'Open nearby services'],
          schemeDefault: 'I can help with subsidy, crop insurance, PM-KISAN, and MGNREGA scheme guidance.',
          schemeDefaultSug: ['PM-KISAN details', 'Crop insurance help', 'Open application flow'],
          mandiWheat: locationLabel
            ? `Latest nearby wheat rates around ${locationLabel} are available below.`
            : 'Latest nearby wheat rates are available below.',
          mandiWheatSug: ['Show rice price', 'Check tomorrow trend', 'Open nearest mandi'],
          mandiDefault: locationLabel
            ? `Tell me your crop name and I will show market rates around ${locationLabel}.`
            : 'Tell me your crop name and I will show market rates around your area.',
          mandiDefaultSug: ['Wheat rate', 'Paddy rate', 'Maize rate'],
          loanTractor: 'Estimated tractor loan setup is prepared below.',
          loanTractorSug: ['Use KCC option', 'Compare NABARD loan', 'Move to apply form'],
          loanDefault: 'Share loan purpose and amount. I will suggest the right option.',
          loanDefaultSug: ['Crop loan', 'Tractor loan', 'Irrigation loan'],
          applyText: 'You can submit details by typing, voice, or call mode.',
          applySug: ['Auto-fill via voice', 'Call support agent', 'Submit application'],
          general: locationLabel
            ? `I can provide schemes, mandi prices, loans, and applications using your ${locationLabel} location context.`
            : 'I can route you to schemes, mandi rates, loan estimate, and application support.',
          generalSug: ['Open schemes', 'Open mandi', 'Start application'],
        }

  if (redirect && redirect !== page) {
    return {
      response: copy.redirectMsg(pageLabels[redirect] || redirect),
      suggestions: copy.topSuggestions,
      redirect,
      cards: [],
      intent: redirect,
    }
  }

  if ((lower.includes('kitni subsidy') || lower.includes('how much subsidy')) && memoryIntent === 'tractor') {
    return {
      response: copy.subsidy,
      suggestions: copy.subsidySug,
      cards: [
        { title: lang === 'hi' ? 'एसएमएएम सहायता' : 'SMAM Support', detail: lang === 'hi' ? 'उपकरण खरीद पर 40% तक सब्सिडी' : 'Up to 40% subsidy on equipment purchase' },
        { title: lang === 'hi' ? 'राज्य ट्रैक्टर सब्सिडी' : 'State Tractor Subsidy', detail: lang === 'hi' ? 'राज्य के अनुसार ₹1.5 लाख तक सहायता' : 'Fixed support up to Rs 1.5 lakh' },
      ],
      intent: 'tractor',
    }
  }

  if (page === 'schemes') {
    if (lower.includes('tractor') || lower.includes('ट्रैक्टर')) {
      return {
        response: copy.schemeTractor,
        suggestions: copy.schemeTractorSug,
        cards: [
          { title: lang === 'hi' ? 'ट्रैक्टर सब्सिडी सहायता' : 'SMAM Tractor Support', detail: lang === 'hi' ? '40% तक सब्सिडी' : 'Subsidy up to 40%' },
          { title: lang === 'hi' ? 'राज्य ट्रैक्टर योजना' : 'State Tractor Subsidy', detail: lang === 'hi' ? '₹1.5 लाख तक सहायता' : 'Support up to Rs 1.5 lakh' },
          { title: lang === 'hi' ? 'किसान क्रेडिट कार्ड लोन' : 'Kisan Credit Card Loan', detail: lang === 'hi' ? '₹3 लाख तक लोन सहायता' : 'Up to Rs 3 lakh loan support' },
        ],
        intent: 'tractor',
      }
    }

    return { response: copy.schemeDefault, suggestions: copy.schemeDefaultSug, cards: cards.schemes, intent: 'scheme_general' }
  }

  if (page === 'mandi') {
    if (lower.includes('gehu') || lower.includes('wheat') || lower.includes('गेहूं')) {
      return { response: copy.mandiWheat, suggestions: copy.mandiWheatSug, cards: cards.mandi, intent: 'wheat_rate' }
    }

    return { response: copy.mandiDefault, suggestions: copy.mandiDefaultSug, cards: cards.mandi, intent: 'mandi_general' }
  }

  if (page === 'loan') {
    if (lower.includes('tractor') || lower.includes('ट्रैक्टर')) {
      return {
        response: copy.loanTractor,
        suggestions: copy.loanTractorSug,
        cards: [
          { title: lang === 'hi' ? 'अनुशंसित राशि' : 'Recommended Amount', detail: lang === 'hi' ? '₹4,00,000' : 'Rs 4,00,000' },
          { title: lang === 'hi' ? 'अनुमानित ब्याज' : 'Estimated Interest', detail: lang === 'hi' ? '6% वार्षिक (संकेतक)' : '6% per year (indicative)' },
          { title: lang === 'hi' ? 'बेहतर विकल्प' : 'Best Fit', detail: lang === 'hi' ? 'केसीसी + नाबार्ड लिंक्ड विकल्प' : 'Kisan Credit Card + NABARD linked products' },
        ],
        intent: 'tractor',
      }
    }

    return { response: copy.loanDefault, suggestions: copy.loanDefaultSug, cards: [], intent: 'loan_general' }
  }

  if (page === 'apply') {
    return { response: copy.applyText, suggestions: copy.applySug, cards: [], intent: memoryIntent || 'apply' }
  }

  return { response: copy.general, suggestions: copy.generalSug, cards: [], intent: memoryIntent || 'general' }
}