export type Language = 'en' | 'fr' | 'ar';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    dashboard: string;
    history: string;
    signIn: string;
    signOut: string;
    profile: string;
  };
  // Hero section
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    cta: string;
    features: {
      graph: { title: string; description: string };
      gnn: { title: string; description: string };
      recommendations: { title: string; description: string };
    };
  };
  // Patient form
  patient: {
    title: string;
    personalInfo: string;
    name: string;
    namePlaceholder: string;
    age: string;
    agePlaceholder: string;
    gender: string;
    male: string;
    female: string;
    vitalSigns: string;
    bloodPressure: string;
    systolic: string;
    diastolic: string;
    heartRate: string;
    bpm: string;
    cholesterol: string;
    bloodSugar: string;
    mgdl: string;
    medicalHistory: string;
    selectConditions: string;
    symptoms: string;
    selectSymptoms: string;
    analyze: string;
    analyzing: string;
  };
  // File upload
  upload: {
    title: string;
    description: string;
    dropzone: string;
    dragActive: string;
    supportedFormats: string;
    images: string;
    ecg: string;
    analyzing: string;
    analyzed: string;
    remove: string;
  };
  // Disease graph
  graph: {
    title: string;
    legend: string;
    riskLevels: {
      high: string;
      medium: string;
      low: string;
      inactive: string;
    };
    edgeTypes: {
      progression: string;
      comorbidity: string;
      riskFactor: string;
    };
    clickToSelect: string;
  };
  // Predictions
  predictions: {
    title: string;
    analyzing: string;
    noPredictions: string;
    probability: string;
    pathway: string;
    riskLevel: string;
    high: string;
    medium: string;
    low: string;
    reasoning: string;
  };
  // Recommendations
  recommendations: {
    title: string;
    noRecommendations: string;
    types: {
      test: string;
      lifestyle: string;
      prevention: string;
      diet: string;
    };
    priority: {
      high: string;
      medium: string;
      low: string;
    };
  };
  // Chat assistant
  chat: {
    title: string;
    placeholder: string;
    welcome: string;
    typing: string;
    send: string;
    error: string;
  };
  // Conditions (diseases)
  conditions: {
    diabetes: string;
    hypertension: string;
    obesity: string;
    smoking: string;
    highCholesterol: string;
    familyHistory: string;
    sedentaryLifestyle: string;
    stress: string;
    // Cardiovascular specific
    coronaryArteryDisease: string;
    arrhythmia: string;
    atrialFibrillation: string;
    heartFailure: string;
    peripheralArteryDisease: string;
    aorticAneurysm: string;
    valvularHeartDisease: string;
    cardiomyopathy: string;
    angina: string;
    myocardialInfarction: string;
  };
  // Symptoms
  symptoms: {
    chestPain: string;
    shortBreath: string;
    fatigue: string;
    palpitations: string;
    dizziness: string;
    swelling: string;
    irregularHeartbeat: string;
    coldSweats: string;
    nausea: string;
    lightHeadedness: string;
  };
  // Auth
  auth: {
    signIn: string;
    signUp: string;
    email: string;
    password: string;
    confirmPassword: string;
    noAccount: string;
    hasAccount: string;
    createAccount: string;
    loginAccount: string;
    error: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    back: string;
    next: string;
    previous: string;
    signInPrompt: string;
  };
  // Footer
  footer: {
    rights: string;
    disclaimer: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      history: 'History',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      profile: 'Profile',
    },
    hero: {
      badge: 'Powered by Graph Neural Networks',
      title1: 'Intelligent',
      title2: 'Disease Prediction',
      subtitle: 'A cardiovascular-focused medical decision-support platform using weighted disease graphs and AI models to predict health risks, progression pathways, and deliver personalized preventive recommendations.',
      cta: 'Start Analysis',
      features: {
        graph: {
          title: 'Cardiovascular Graph',
          description: 'Weighted directed graph modeling cardiovascular disease relationships and progression pathways',
        },
        gnn: {
          title: 'AI Prediction',
          description: 'Advanced AI analyzes patient records and medical files to predict probable diseases',
        },
        recommendations: {
          title: 'Smart Recommendations',
          description: 'Personalized tests, lifestyle changes, and preventive measures for heart health',
        },
      },
    },
    patient: {
      title: 'Patient Information',
      personalInfo: 'Personal Information',
      name: 'Full Name',
      namePlaceholder: 'Enter patient name',
      age: 'Age',
      agePlaceholder: 'Years',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      vitalSigns: 'Vital Signs',
      bloodPressure: 'Blood Pressure',
      systolic: 'Systolic',
      diastolic: 'Diastolic',
      heartRate: 'Heart Rate',
      bpm: 'bpm',
      cholesterol: 'Total Cholesterol',
      bloodSugar: 'Blood Sugar',
      mgdl: 'mg/dL',
      medicalHistory: 'Medical History',
      selectConditions: 'Select existing conditions',
      symptoms: 'Current Symptoms',
      selectSymptoms: 'Select current symptoms',
      analyze: 'Analyze Risk',
      analyzing: 'Analyzing...',
    },
    upload: {
      title: 'Medical Files',
      description: 'Upload medical images or ECG data for AI analysis',
      dropzone: 'Drop files here or click to upload',
      dragActive: 'Drop files here',
      supportedFormats: 'Supported formats',
      images: 'Medical Images (X-ray, MRI, CT)',
      ecg: 'ECG Data (PDF, Images)',
      analyzing: 'Analyzing...',
      analyzed: 'Analysis complete',
      remove: 'Remove',
    },
    graph: {
      title: 'Cardiovascular Disease Network',
      legend: 'Risk Levels',
      riskLevels: {
        high: 'High Risk',
        medium: 'Medium Risk',
        low: 'Low Risk',
        inactive: 'Inactive',
      },
      edgeTypes: {
        progression: 'Disease Progression',
        comorbidity: 'Comorbidity',
        riskFactor: 'Risk Factor',
      },
      clickToSelect: 'Click a node to see details',
    },
    predictions: {
      title: 'Risk Predictions',
      analyzing: 'Analyzing patient data...',
      noPredictions: 'Predictions will appear here after analysis',
      probability: 'Probability',
      pathway: 'Progression Pathway',
      riskLevel: 'Risk Level',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      reasoning: 'Clinical Reasoning',
    },
    recommendations: {
      title: 'Personalized Recommendations',
      noRecommendations: 'Recommendations will appear here after analysis',
      types: {
        test: 'Medical Test',
        lifestyle: 'Lifestyle Change',
        prevention: 'Prevention',
        diet: 'Dietary Advice',
      },
      priority: {
        high: 'High Priority',
        medium: 'Medium Priority',
        low: 'Low Priority',
      },
    },
    chat: {
      title: 'Medical Assistant',
      placeholder: 'Ask about your results...',
      welcome: 'Hello! I\'m your medical assistant. Ask me about disease predictions, risk factors, or recommended preventive measures.',
      typing: 'Thinking...',
      send: 'Send',
      error: 'An error occurred. Please try again.',
    },
    conditions: {
      diabetes: 'Diabetes',
      hypertension: 'Hypertension',
      obesity: 'Obesity',
      smoking: 'Smoking',
      highCholesterol: 'High Cholesterol',
      familyHistory: 'Family History of Heart Disease',
      sedentaryLifestyle: 'Sedentary Lifestyle',
      stress: 'Chronic Stress',
      coronaryArteryDisease: 'Coronary Artery Disease',
      arrhythmia: 'Arrhythmia',
      atrialFibrillation: 'Atrial Fibrillation',
      heartFailure: 'Heart Failure',
      peripheralArteryDisease: 'Peripheral Artery Disease',
      aorticAneurysm: 'Aortic Aneurysm',
      valvularHeartDisease: 'Valvular Heart Disease',
      cardiomyopathy: 'Cardiomyopathy',
      angina: 'Angina',
      myocardialInfarction: 'Myocardial Infarction',
    },
    symptoms: {
      chestPain: 'Chest Pain',
      shortBreath: 'Shortness of Breath',
      fatigue: 'Fatigue',
      palpitations: 'Palpitations',
      dizziness: 'Dizziness',
      swelling: 'Leg Swelling',
      irregularHeartbeat: 'Irregular Heartbeat',
      coldSweats: 'Cold Sweats',
      nausea: 'Nausea',
      lightHeadedness: 'Light-headedness',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      createAccount: 'Create Account',
      loginAccount: 'Login',
      error: 'Authentication failed. Please try again.',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      signInPrompt: 'Sign in to save your predictions',
    },
    footer: {
      rights: 'All rights reserved',
      disclaimer: 'This is a decision-support tool. Always consult healthcare professionals.',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      dashboard: 'Tableau de bord',
      history: 'Historique',
      signIn: 'Connexion',
      signOut: 'Déconnexion',
      profile: 'Profil',
    },
    hero: {
      badge: 'Propulsé par les Réseaux Neuronaux de Graphes',
      title1: 'Prédiction',
      title2: 'Intelligente des Maladies',
      subtitle: "Une plateforme d'aide à la décision médicale axée sur le cardiovasculaire, utilisant des graphes de maladies pondérés et des modèles d'IA pour prédire les risques de santé et fournir des recommandations préventives personnalisées.",
      cta: "Démarrer l'Analyse",
      features: {
        graph: {
          title: 'Graphe Cardiovasculaire',
          description: 'Graphe orienté pondéré modélisant les relations entre maladies cardiovasculaires et voies de progression',
        },
        gnn: {
          title: 'Prédiction IA',
          description: "L'IA avancée analyse les dossiers patients et fichiers médicaux pour prédire les maladies probables",
        },
        recommendations: {
          title: 'Recommandations Intelligentes',
          description: 'Tests personnalisés, changements de mode de vie et mesures préventives pour la santé cardiaque',
        },
      },
    },
    patient: {
      title: 'Informations Patient',
      personalInfo: 'Informations Personnelles',
      name: 'Nom Complet',
      namePlaceholder: 'Entrez le nom du patient',
      age: 'Âge',
      agePlaceholder: 'Années',
      gender: 'Sexe',
      male: 'Homme',
      female: 'Femme',
      vitalSigns: 'Signes Vitaux',
      bloodPressure: 'Pression Artérielle',
      systolic: 'Systolique',
      diastolic: 'Diastolique',
      heartRate: 'Fréquence Cardiaque',
      bpm: 'bpm',
      cholesterol: 'Cholestérol Total',
      bloodSugar: 'Glycémie',
      mgdl: 'mg/dL',
      medicalHistory: 'Antécédents Médicaux',
      selectConditions: 'Sélectionnez les conditions existantes',
      symptoms: 'Symptômes Actuels',
      selectSymptoms: 'Sélectionnez les symptômes actuels',
      analyze: 'Analyser le Risque',
      analyzing: 'Analyse en cours...',
    },
    upload: {
      title: 'Fichiers Médicaux',
      description: "Téléchargez des images médicales ou des données ECG pour l'analyse IA",
      dropzone: 'Déposez les fichiers ici ou cliquez pour télécharger',
      dragActive: 'Déposez les fichiers ici',
      supportedFormats: 'Formats supportés',
      images: 'Images Médicales (Radio, IRM, Scanner)',
      ecg: 'Données ECG (PDF, Images)',
      analyzing: 'Analyse en cours...',
      analyzed: 'Analyse terminée',
      remove: 'Supprimer',
    },
    graph: {
      title: 'Réseau des Maladies Cardiovasculaires',
      legend: 'Niveaux de Risque',
      riskLevels: {
        high: 'Risque Élevé',
        medium: 'Risque Moyen',
        low: 'Risque Faible',
        inactive: 'Inactif',
      },
      edgeTypes: {
        progression: 'Progression de Maladie',
        comorbidity: 'Comorbidité',
        riskFactor: 'Facteur de Risque',
      },
      clickToSelect: 'Cliquez sur un nœud pour voir les détails',
    },
    predictions: {
      title: 'Prédictions de Risque',
      analyzing: 'Analyse des données patient...',
      noPredictions: "Les prédictions apparaîtront ici après l'analyse",
      probability: 'Probabilité',
      pathway: 'Voie de Progression',
      riskLevel: 'Niveau de Risque',
      high: 'Élevé',
      medium: 'Moyen',
      low: 'Faible',
      reasoning: 'Raisonnement Clinique',
    },
    recommendations: {
      title: 'Recommandations Personnalisées',
      noRecommendations: "Les recommandations apparaîtront ici après l'analyse",
      types: {
        test: 'Test Médical',
        lifestyle: 'Mode de Vie',
        prevention: 'Prévention',
        diet: 'Conseil Alimentaire',
      },
      priority: {
        high: 'Priorité Haute',
        medium: 'Priorité Moyenne',
        low: 'Priorité Basse',
      },
    },
    chat: {
      title: 'Assistant Médical',
      placeholder: 'Posez une question sur vos résultats...',
      welcome: "Bonjour ! Je suis votre assistant médical. Posez-moi des questions sur les prédictions de maladies, les facteurs de risque ou les mesures préventives recommandées.",
      typing: 'Réflexion...',
      send: 'Envoyer',
      error: "Une erreur s'est produite. Veuillez réessayer.",
    },
    conditions: {
      diabetes: 'Diabète',
      hypertension: 'Hypertension',
      obesity: 'Obésité',
      smoking: 'Tabagisme',
      highCholesterol: 'Cholestérol Élevé',
      familyHistory: 'Antécédents Familiaux de Maladie Cardiaque',
      sedentaryLifestyle: 'Mode de Vie Sédentaire',
      stress: 'Stress Chronique',
      coronaryArteryDisease: 'Maladie Coronarienne',
      arrhythmia: 'Arythmie',
      atrialFibrillation: 'Fibrillation Auriculaire',
      heartFailure: 'Insuffisance Cardiaque',
      peripheralArteryDisease: 'Artériopathie Périphérique',
      aorticAneurysm: 'Anévrisme Aortique',
      valvularHeartDisease: 'Valvulopathie',
      cardiomyopathy: 'Cardiomyopathie',
      angina: 'Angine de Poitrine',
      myocardialInfarction: 'Infarctus du Myocarde',
    },
    symptoms: {
      chestPain: 'Douleur Thoracique',
      shortBreath: 'Essoufflement',
      fatigue: 'Fatigue',
      palpitations: 'Palpitations',
      dizziness: 'Vertiges',
      swelling: 'Œdème des Jambes',
      irregularHeartbeat: 'Battement Cardiaque Irrégulier',
      coldSweats: 'Sueurs Froides',
      nausea: 'Nausée',
      lightHeadedness: 'Étourdissement',
    },
    auth: {
      signIn: 'Connexion',
      signUp: 'Inscription',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      noAccount: "Pas de compte ?",
      hasAccount: 'Déjà un compte ?',
      createAccount: 'Créer un compte',
      loginAccount: 'Se connecter',
      error: "L'authentification a échoué. Veuillez réessayer.",
    },
    common: {
      loading: 'Chargement...',
      error: "Une erreur s'est produite",
      success: 'Succès',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      signInPrompt: 'Connectez-vous pour sauvegarder vos prédictions',
    },
    footer: {
      rights: 'Tous droits réservés',
      disclaimer: "Ceci est un outil d'aide à la décision. Consultez toujours des professionnels de santé.",
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      dashboard: 'لوحة التحكم',
      history: 'السجل',
      signIn: 'تسجيل الدخول',
      signOut: 'تسجيل الخروج',
      profile: 'الملف الشخصي',
    },
    hero: {
      badge: 'مدعوم بشبكات الرسم البياني العصبية',
      title1: 'التنبؤ الذكي',
      title2: 'بالأمراض',
      subtitle: 'منصة دعم القرار الطبي المتخصصة في أمراض القلب والأوعية الدموية، تستخدم الرسوم البيانية المرجحة للأمراض ونماذج الذكاء الاصطناعي للتنبؤ بالمخاطر الصحية وتقديم توصيات وقائية مخصصة.',
      cta: 'بدء التحليل',
      features: {
        graph: {
          title: 'رسم القلب البياني',
          description: 'رسم بياني موجه ومرجح يمثل علاقات أمراض القلب والأوعية الدموية ومسارات التطور',
        },
        gnn: {
          title: 'تنبؤ الذكاء الاصطناعي',
          description: 'الذكاء الاصطناعي المتقدم يحلل سجلات المرضى والملفات الطبية للتنبؤ بالأمراض المحتملة',
        },
        recommendations: {
          title: 'توصيات ذكية',
          description: 'فحوصات مخصصة وتغييرات في نمط الحياة وإجراءات وقائية لصحة القلب',
        },
      },
    },
    patient: {
      title: 'معلومات المريض',
      personalInfo: 'المعلومات الشخصية',
      name: 'الاسم الكامل',
      namePlaceholder: 'أدخل اسم المريض',
      age: 'العمر',
      agePlaceholder: 'السنوات',
      gender: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',
      vitalSigns: 'العلامات الحيوية',
      bloodPressure: 'ضغط الدم',
      systolic: 'الانقباضي',
      diastolic: 'الانبساطي',
      heartRate: 'معدل ضربات القلب',
      bpm: 'نبضة/دقيقة',
      cholesterol: 'الكوليسترول الكلي',
      bloodSugar: 'سكر الدم',
      mgdl: 'ملغ/ديسيلتر',
      medicalHistory: 'التاريخ الطبي',
      selectConditions: 'اختر الحالات الموجودة',
      symptoms: 'الأعراض الحالية',
      selectSymptoms: 'اختر الأعراض الحالية',
      analyze: 'تحليل المخاطر',
      analyzing: 'جاري التحليل...',
    },
    upload: {
      title: 'الملفات الطبية',
      description: 'ارفع الصور الطبية أو بيانات تخطيط القلب للتحليل بالذكاء الاصطناعي',
      dropzone: 'اسحب الملفات هنا أو انقر للرفع',
      dragActive: 'أسقط الملفات هنا',
      supportedFormats: 'الصيغ المدعومة',
      images: 'الصور الطبية (أشعة، رنين، مقطعية)',
      ecg: 'بيانات تخطيط القلب (PDF، صور)',
      analyzing: 'جاري التحليل...',
      analyzed: 'اكتمل التحليل',
      remove: 'إزالة',
    },
    graph: {
      title: 'شبكة أمراض القلب والأوعية الدموية',
      legend: 'مستويات المخاطر',
      riskLevels: {
        high: 'خطر مرتفع',
        medium: 'خطر متوسط',
        low: 'خطر منخفض',
        inactive: 'غير نشط',
      },
      edgeTypes: {
        progression: 'تطور المرض',
        comorbidity: 'أمراض مصاحبة',
        riskFactor: 'عامل خطر',
      },
      clickToSelect: 'انقر على عقدة لرؤية التفاصيل',
    },
    predictions: {
      title: 'توقعات المخاطر',
      analyzing: 'جاري تحليل بيانات المريض...',
      noPredictions: 'ستظهر التوقعات هنا بعد التحليل',
      probability: 'الاحتمالية',
      pathway: 'مسار التطور',
      riskLevel: 'مستوى الخطر',
      high: 'مرتفع',
      medium: 'متوسط',
      low: 'منخفض',
      reasoning: 'التفسير السريري',
    },
    recommendations: {
      title: 'التوصيات المخصصة',
      noRecommendations: 'ستظهر التوصيات هنا بعد التحليل',
      types: {
        test: 'فحص طبي',
        lifestyle: 'تغيير نمط الحياة',
        prevention: 'وقاية',
        diet: 'نصيحة غذائية',
      },
      priority: {
        high: 'أولوية عالية',
        medium: 'أولوية متوسطة',
        low: 'أولوية منخفضة',
      },
    },
    chat: {
      title: 'المساعد الطبي',
      placeholder: 'اسأل عن نتائجك...',
      welcome: 'مرحباً! أنا مساعدك الطبي. اسألني عن توقعات الأمراض أو عوامل الخطر أو الإجراءات الوقائية الموصى بها.',
      typing: 'جاري التفكير...',
      send: 'إرسال',
      error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    },
    conditions: {
      diabetes: 'السكري',
      hypertension: 'ارتفاع ضغط الدم',
      obesity: 'السمنة',
      smoking: 'التدخين',
      highCholesterol: 'ارتفاع الكوليسترول',
      familyHistory: 'تاريخ عائلي لأمراض القلب',
      sedentaryLifestyle: 'نمط حياة خامل',
      stress: 'التوتر المزمن',
      coronaryArteryDisease: 'مرض الشريان التاجي',
      arrhythmia: 'اضطراب نظم القلب',
      atrialFibrillation: 'الرجفان الأذيني',
      heartFailure: 'فشل القلب',
      peripheralArteryDisease: 'مرض الشرايين الطرفية',
      aorticAneurysm: 'تمدد الأوعية الأبهري',
      valvularHeartDisease: 'مرض صمامات القلب',
      cardiomyopathy: 'اعتلال عضلة القلب',
      angina: 'الذبحة الصدرية',
      myocardialInfarction: 'احتشاء عضلة القلب',
    },
    symptoms: {
      chestPain: 'ألم الصدر',
      shortBreath: 'ضيق التنفس',
      fatigue: 'التعب',
      palpitations: 'خفقان القلب',
      dizziness: 'الدوخة',
      swelling: 'تورم الساقين',
      irregularHeartbeat: 'نبض قلب غير منتظم',
      coldSweats: 'تعرق بارد',
      nausea: 'الغثيان',
      lightHeadedness: 'الدوار الخفيف',
    },
    auth: {
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      noAccount: 'ليس لديك حساب؟',
      hasAccount: 'لديك حساب بالفعل؟',
      createAccount: 'إنشاء حساب',
      loginAccount: 'دخول',
      error: 'فشل التحقق. يرجى المحاولة مرة أخرى.',
    },
    common: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      success: 'نجاح',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      signInPrompt: 'سجل الدخول لحفظ توقعاتك',
    },
    footer: {
      rights: 'جميع الحقوق محفوظة',
      disclaimer: 'هذه أداة لدعم القرار. استشر دائماً المختصين في الرعاية الصحية.',
    },
  },
};
