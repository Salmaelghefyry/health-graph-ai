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
  // Detailed Form
  form: {
    personalInfo: string;
    fullName: string;
    enterName: string;
    age: string;
    years: string;
    sex: string;
    male: string;
    female: string;
    pregnant: string;
    menopause: string;
    bloodType: string;
    iDontKnow: string;
    lifestyle: string;
    smokingStatus: string;
    never: string;
    former: string;
    current: string;
    cigarettesPerDay: string;
    alcoholConsumption: string;
    none: string;
    occasional: string;
    moderate: string;
    heavy: string;
    physicalActivity: string;
    sedentary: string;
    light: string;
    moderateActivity: string;
    active: string;
    vitalSigns: string;
    bloodPressure: string;
    systolic: string;
    diastolic: string;
    heartRate: string;
    bpm: string;
    physicalMeasurements: string;
    weight: string;
    height: string;
    bmi: string;
    waistCircumference: string;
    bmiCategories: {
      underweight: string;
      normal: string;
      overweight: string;
      obese: string;
    };
    labValues: string;
    glucoseMetabolism: string;
    fastingBloodSugar: string;
    hba1c: string;
    lipidProfile: string;
    totalCholesterol: string;
    ldlCholesterol: string;
    hdlCholesterol: string;
    triglycerides: string;
    creatinine: string;
    medicalHistory: string;
    existingConditions: string;
    familyHistory: string;
    currentSymptoms: string;
    conditionsSelected: string;
    symptomsSelected: string;
    analyzeRisk: string;
    analyzing: string;
    conditionsList: {
      diabetes: string;
      hypertension: string;
      heartDisease: string;
      coronaryArtery: string;
      arrhythmia: string;
      heartFailure: string;
      strokeHistory: string;
      kidneyDisease: string;
      obesity: string;
      sleepApnea: string;
      thyroid: string;
      asthma: string;
    };
    symptomsList: {
      chestPain: string;
      shortnessBreath: string;
      palpitations: string;
      fatigue: string;
      dizziness: string;
      swellingLegs: string;
      irregularHeartbeat: string;
      coldSweats: string;
      nausea: string;
      frequentUrination: string;
      excessiveThirst: string;
      blurredVision: string;
    };
    familyHistoryList: {
      heartDisease: string;
      diabetes: string;
      hypertension: string;
      stroke: string;
      cancer: string;
      suddenDeath: string;
    };
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
    status: string;
    nodesLabel: string;
    edgesLabel: string;
    errorLabel: string;
    neutralLabel: string;
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
    foundRiskFactors: string;
  };
  // Domain data: disease display names (map canonical ids to localized names)
  diseases: Record<string, string>;
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
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    graphTitle: string;
    signInPrompt: string;
    signIn: string;
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
  };
  // Footer
  footer: {
    rights: string;
    disclaimer: string;
    poweredBy: string;
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
    form: {
      personalInfo: 'Personal Information',
      fullName: 'Full Name',
      enterName: 'Enter patient name',
      age: 'Age',
      years: 'Years',
      sex: 'Sex',
      male: 'Male',
      female: 'Female',
      pregnant: 'Pregnant',
      menopause: 'Menopause',
      bloodType: 'Blood Type',
      iDontKnow: "I don't know",
      lifestyle: 'Lifestyle Factors',
      smokingStatus: 'Smoking Status',
      never: 'Never',
      former: 'Former',
      current: 'Current',
      cigarettesPerDay: 'Cigarettes per day',
      alcoholConsumption: 'Alcohol Consumption',
      none: 'None',
      occasional: 'Occasional',
      moderate: 'Moderate',
      heavy: 'Heavy',
      physicalActivity: 'Physical Activity',
      sedentary: 'Sedentary',
      light: 'Light',
      moderateActivity: 'Moderate',
      active: 'Active',
      vitalSigns: 'Vital Signs',
      bloodPressure: 'Blood Pressure',
      systolic: 'Systolic',
      diastolic: 'Diastolic',
      heartRate: 'Heart Rate',
      bpm: 'bpm',
      physicalMeasurements: 'Physical Measurements',
      weight: 'Weight',
      height: 'Height',
      bmi: 'BMI',
      waistCircumference: 'Waist Circumference',
      bmiCategories: {
        underweight: 'Underweight',
        normal: 'Normal',
        overweight: 'Overweight',
        obese: 'Obese',
      },
      labValues: 'Laboratory Values',
      glucoseMetabolism: 'Glucose Metabolism',
      fastingBloodSugar: 'Fasting Blood Sugar',
      hba1c: 'HbA1c',
      lipidProfile: 'Lipid Profile',
      totalCholesterol: 'Total Cholesterol',
      ldlCholesterol: 'LDL Cholesterol',
      hdlCholesterol: 'HDL Cholesterol',
      triglycerides: 'Triglycerides',
      creatinine: 'Creatinine',
      medicalHistory: 'Medical History',
      existingConditions: 'Existing Conditions',
      familyHistory: 'Family History',
      currentSymptoms: 'Current Symptoms',
      conditionsSelected: 'conditions selected',
      symptomsSelected: 'symptoms selected',
      analyzeRisk: 'Analyze Risk Profile',
      analyzing: 'Analyzing...',
      selectAtLeastOne: 'Please select at least one condition or symptom.',
      conditionsList: {
        diabetes: 'Diabetes',
        hypertension: 'Hypertension',
        heartDisease: 'Heart Disease',
        coronaryArtery: 'Coronary Artery Disease',
        arrhythmia: 'Arrhythmia',
        heartFailure: 'Heart Failure',
        strokeHistory: 'Stroke (History)',
        kidneyDisease: 'Kidney Disease',
        obesity: 'Obesity',
        sleepApnea: 'Sleep Apnea',
        thyroid: 'Thyroid Disorder',
        asthma: 'Asthma/COPD',
      },
      symptomsList: {
        chestPain: 'Chest Pain',
        shortnessBreath: 'Shortness of Breath',
        palpitations: 'Palpitations',
        fatigue: 'Fatigue',
        dizziness: 'Dizziness',
        swellingLegs: 'Swelling in Legs',
        irregularHeartbeat: 'Irregular Heartbeat',
        coldSweats: 'Cold Sweats',
        nausea: 'Nausea',
        frequentUrination: 'Frequent Urination',
        excessiveThirst: 'Excessive Thirst',
        blurredVision: 'Blurred Vision',
      },
      familyHistoryList: {
        heartDisease: 'Heart Disease',
        diabetes: 'Diabetes',
        hypertension: 'Hypertension',
        stroke: 'Stroke',
        cancer: 'Cancer',
        suddenDeath: 'Sudden Cardiac Death',
      },
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
      signInToAnalyze: 'Sign in to analyze files',
    },
    graph: {
      title: 'Cardiovascular Disease Network',
      legend: 'Risk Levels',
      status: 'Graph status',
      nodesLabel: 'Nodes',
      edgesLabel: 'Edges',
      errorLabel: 'Error',
      neutralLabel: 'Neutral',
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
      runningModel: 'Running GNN prediction model',
      noPredictions: 'Predictions will appear here after analysis',
      probability: 'Probability',
      pathway: 'Progression Pathway',
      riskLevel: 'Risk Level',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      reasoning: 'Clinical Reasoning',
      foundRiskFactors: 'Found {count} potential risk factors.',
    },
    diseases: {
      hypertension: 'Hypertension',
      sleep_apnea: 'Sleep Apnea',
      heart_disease: 'Heart Disease',
      stroke: 'Stroke',
      diabetes: 'Diabetes'
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
      title: 'Medical AI Assistant',
      subtitle: 'Explain predictions & graph relationships',
      placeholder: 'Ask about your results...',
      welcome: "Hello! I'm your medical AI assistant. I can help you understand the disease predictions, explain relationships in the medical graph, and provide context for the recommendations. How can I help you today?",
      typing: 'Thinking...',
      send: 'Send',
      error: 'An error occurred. Please try again.',
    },
    dashboard: {
      title: 'Disease Risk',
      subtitle: 'Analysis Dashboard',
      graphTitle: 'Medical Knowledge Graph',
      signInPrompt: 'Sign in to save your predictions and track your health over time.',
      signIn: 'Sign in',
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
    },
    footer: {
      rights: 'All rights reserved',
      disclaimer: 'This is a decision-support tool. Always consult healthcare professionals.',
      poweredBy: 'Powered by Graph Neural Networks',
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
    form: {
      personalInfo: 'Informations Personnelles',
      fullName: 'Nom Complet',
      enterName: 'Entrez le nom du patient',
      age: 'Âge',
      years: 'Années',
      sex: 'Sexe',
      male: 'Homme',
      female: 'Femme',
      pregnant: 'Enceinte',
      menopause: 'Ménopause',
      bloodType: 'Groupe Sanguin',
      iDontKnow: "Je ne sais pas",
      lifestyle: 'Mode de Vie',
      smokingStatus: 'Statut Tabagique',
      never: 'Jamais',
      former: 'Ancien',
      current: 'Actuel',
      cigarettesPerDay: 'Cigarettes par jour',
      alcoholConsumption: 'Consommation d\'Alcool',
      none: 'Aucune',
      occasional: 'Occasionnelle',
      moderate: 'Modérée',
      heavy: 'Importante',
      physicalActivity: 'Activité Physique',
      sedentary: 'Sédentaire',
      light: 'Légère',
      moderateActivity: 'Modérée',
      active: 'Active',
      vitalSigns: 'Signes Vitaux',
      bloodPressure: 'Pression Artérielle',
      systolic: 'Systolique',
      diastolic: 'Diastolique',
      heartRate: 'Fréquence Cardiaque',
      bpm: 'bpm',
      physicalMeasurements: 'Mesures Physiques',
      weight: 'Poids',
      height: 'Taille',
      bmi: 'IMC',
      waistCircumference: 'Tour de Taille',
      bmiCategories: {
        underweight: 'Insuffisant',
        normal: 'Normal',
        overweight: 'Surpoids',
        obese: 'Obésité',
      },
      labValues: 'Valeurs de Laboratoire',
      glucoseMetabolism: 'Métabolisme du Glucose',
      fastingBloodSugar: 'Glycémie à Jeun',
      hba1c: 'HbA1c',
      lipidProfile: 'Bilan Lipidique',
      totalCholesterol: 'Cholestérol Total',
      ldlCholesterol: 'Cholestérol LDL',
      hdlCholesterol: 'Cholestérol HDL',
      triglycerides: 'Triglycérides',
      creatinine: 'Créatinine',
      medicalHistory: 'Antécédents Médicaux',
      existingConditions: 'Conditions Existantes',
      familyHistory: 'Antécédents Familiaux',
      currentSymptoms: 'Symptômes Actuels',
      conditionsSelected: 'conditions sélectionnées',
      symptomsSelected: 'symptômes sélectionnés',
      analyzeRisk: 'Analyser le Profil de Risque',
      analyzing: 'Analyse en cours...',
      selectAtLeastOne: 'Veuillez sélectionner au moins une condition ou un symptôme.',
      conditionsList: {
        diabetes: 'Diabète',
        hypertension: 'Hypertension',
        heartDisease: 'Maladie Cardiaque',
        coronaryArtery: 'Maladie Coronarienne',
        arrhythmia: 'Arythmie',
        heartFailure: 'Insuffisance Cardiaque',
        strokeHistory: 'AVC (Antécédent)',
        kidneyDisease: 'Maladie Rénale',
        obesity: 'Obésité',
        sleepApnea: 'Apnée du Sommeil',
        thyroid: 'Trouble Thyroïdien',
        asthma: 'Asthme/BPCO',
      },
      symptomsList: {
        chestPain: 'Douleur Thoracique',
        shortnessBreath: 'Essoufflement',
        palpitations: 'Palpitations',
        fatigue: 'Fatigue',
        dizziness: 'Vertiges',
        swellingLegs: 'Gonflement des Jambes',
        irregularHeartbeat: 'Battements Irréguliers',
        coldSweats: 'Sueurs Froides',
        nausea: 'Nausées',
        frequentUrination: 'Mictions Fréquentes',
        excessiveThirst: 'Soif Excessive',
        blurredVision: 'Vision Floue',
      },
      familyHistoryList: {
        heartDisease: 'Maladie Cardiaque',
        diabetes: 'Diabète',
        hypertension: 'Hypertension',
        stroke: 'AVC',
        cancer: 'Cancer',
        suddenDeath: 'Mort Subite Cardiaque',
      },
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
      remove: 'Supprimer',      signInToAnalyze: 'Connectez-vous pour analyser des fichiers',    },
    graph: {
      title: 'Réseau des Maladies Cardiovasculaires',
      legend: 'Niveaux de Risque',
      status: 'État du Graphe',
      nodesLabel: 'Nœuds',
      edgesLabel: 'Arêtes',
      errorLabel: 'Erreur',
      neutralLabel: 'Inactif',
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
      runningModel: "Exécution du modèle GNN",
      noPredictions: "Les prédictions apparaîtront ici après l'analyse",
      probability: 'Probabilité',
      pathway: 'Voie de Progression',
      riskLevel: 'Niveau de Risque',
      high: 'Élevé',
      medium: 'Moyen',
      low: 'Faible',
      reasoning: 'Raisonnement Clinique',
      foundRiskFactors: 'Trouvé {count} facteurs de risque potentiels.',
    },
    diseases: {
      hypertension: 'Hypertension',
      sleep_apnea: 'Apnée du sommeil',
      heart_disease: 'Maladie cardiaque',
      stroke: 'AVC',
      diabetes: 'Diabète'
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
      title: 'Assistant IA Médical',
      subtitle: 'Expliquez les prédictions & les relations du graphe',
      placeholder: 'Posez une question sur vos résultats...',
      welcome: "Bonjour ! Je suis votre assistant médical IA. Je peux vous aider à comprendre les prédictions de maladies, expliquer les relations dans le graphe médical et fournir le contexte des recommandations. Comment puis-je vous aider ?",
      typing: 'Réflexion...',
      send: 'Envoyer',
      error: "Une erreur s'est produite. Veuillez réessayer.",
    },
    dashboard: {
      title: 'Risque de Maladie',
      subtitle: 'Tableau de Bord d\'Analyse',
      graphTitle: 'Graphe de Connaissances Médicales',
      signInPrompt: 'Connectez-vous pour sauvegarder vos prédictions et suivre votre santé.',
      signIn: 'Se connecter',
    },
    auth: {
      signIn: 'Connexion',
      signUp: 'Inscription',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      noAccount: "Pas encore de compte ?",
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
    },
    footer: {
      rights: 'Tous droits réservés',
      disclaimer: "Ceci est un outil d'aide à la décision. Consultez toujours des professionnels de santé.",
      poweredBy: 'Propulsé par Réseaux Neuronaux de Graphes',
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
      title1: 'التنبؤ',
      title2: 'الذكي بالأمراض',
      subtitle: 'منصة دعم القرار الطبي المتخصصة في أمراض القلب والأوعية الدموية، تستخدم رسومات بيانية موزونة للأمراض ونماذج الذكاء الاصطناعي للتنبؤ بالمخاطر الصحية وتقديم توصيات وقائية مخصصة.',
      cta: 'بدء التحليل',
      features: {
        graph: {
          title: 'الرسم البياني القلبي',
          description: 'رسم بياني موجه وموزون يصور العلاقات بين أمراض القلب ومسارات التطور',
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
    form: {
      personalInfo: 'المعلومات الشخصية',
      fullName: 'الاسم الكامل',
      enterName: 'أدخل اسم المريض',
      age: 'العمر',
      years: 'سنوات',
      sex: 'الجنس',
      male: 'ذكر',
      female: 'أنثى',
      pregnant: 'حامل',
      menopause: 'سن اليأس',
      bloodType: 'فصيلة الدم',
      iDontKnow: 'لا أعرف',
      lifestyle: 'نمط الحياة',
      smokingStatus: 'حالة التدخين',
      never: 'أبداً',
      former: 'سابق',
      current: 'حالي',
      cigarettesPerDay: 'السجائر يومياً',
      alcoholConsumption: 'استهلاك الكحول',
      none: 'لا شيء',
      occasional: 'أحياناً',
      moderate: 'معتدل',
      heavy: 'كثير',
      physicalActivity: 'النشاط البدني',
      sedentary: 'خامل',
      light: 'خفيف',
      moderateActivity: 'معتدل',
      active: 'نشط',
      vitalSigns: 'العلامات الحيوية',
      bloodPressure: 'ضغط الدم',
      systolic: 'الانقباضي',
      diastolic: 'الانبساطي',
      heartRate: 'معدل ضربات القلب',
      bpm: 'نبضة/دقيقة',
      physicalMeasurements: 'القياسات الجسدية',
      weight: 'الوزن',
      height: 'الطول',
      bmi: 'مؤشر كتلة الجسم',
      waistCircumference: 'محيط الخصر',
      bmiCategories: {
        underweight: 'نقص الوزن',
        normal: 'طبيعي',
        overweight: 'زيادة الوزن',
        obese: 'سمنة',
      },
      labValues: 'القيم المخبرية',
      glucoseMetabolism: 'استقلاب الجلوكوز',
      fastingBloodSugar: 'سكر الدم الصائم',
      hba1c: 'الهيموغلوبين السكري',
      lipidProfile: 'تحليل الدهون',
      totalCholesterol: 'الكوليسترول الكلي',
      ldlCholesterol: 'الكوليسترول الضار',
      hdlCholesterol: 'الكوليسترول الجيد',
      triglycerides: 'الدهون الثلاثية',
      creatinine: 'الكرياتينين',
      medicalHistory: 'التاريخ الطبي',
      existingConditions: 'الحالات الموجودة',
      familyHistory: 'التاريخ العائلي',
      currentSymptoms: 'الأعراض الحالية',
      conditionsSelected: 'حالة مختارة',
      symptomsSelected: 'عرض مختار',
      analyzeRisk: 'تحليل ملف المخاطر',
      analyzing: 'جاري التحليل...',
      selectAtLeastOne: 'يرجى تحديد حالة واحدة على الأقل أو عرض واحد.',
      conditionsList: {
        diabetes: 'السكري',
        hypertension: 'ارتفاع ضغط الدم',
        heartDisease: 'أمراض القلب',
        coronaryArtery: 'مرض الشريان التاجي',
        arrhythmia: 'عدم انتظام ضربات القلب',
        heartFailure: 'فشل القلب',
        strokeHistory: 'سكتة دماغية (سابقة)',
        kidneyDisease: 'أمراض الكلى',
        obesity: 'السمنة',
        sleepApnea: 'انقطاع النفس أثناء النوم',
        thyroid: 'اضطرابات الغدة الدرقية',
        asthma: 'الربو/مرض الانسداد الرئوي',
      },
      symptomsList: {
        chestPain: 'ألم في الصدر',
        shortnessBreath: 'ضيق التنفس',
        palpitations: 'خفقان القلب',
        fatigue: 'التعب',
        dizziness: 'الدوخة',
        swellingLegs: 'تورم الساقين',
        irregularHeartbeat: 'عدم انتظام ضربات القلب',
        coldSweats: 'العرق البارد',
        nausea: 'الغثيان',
        frequentUrination: 'كثرة التبول',
        excessiveThirst: 'العطش الشديد',
        blurredVision: 'عدم وضوح الرؤية',
      },
      familyHistoryList: {
        heartDisease: 'أمراض القلب',
        diabetes: 'السكري',
        hypertension: 'ارتفاع ضغط الدم',
        stroke: 'السكتة الدماغية',
        cancer: 'السرطان',
        suddenDeath: 'الموت القلبي المفاجئ',
      },
    },
    upload: {
      title: 'الملفات الطبية',
      description: 'قم بتحميل الصور الطبية أو بيانات تخطيط القلب للتحليل بالذكاء الاصطناعي',
      dropzone: 'أسقط الملفات هنا أو انقر للتحميل',
      dragActive: 'أسقط الملفات هنا',
      supportedFormats: 'الصيغ المدعومة',
      images: 'صور طبية (أشعة، رنين، مقطعية)',
      ecg: 'بيانات تخطيط القلب (PDF، صور)',
      analyzing: 'جاري التحليل...',
      analyzed: 'اكتمل التحليل',
      remove: 'إزالة',
      signInToAnalyze: 'سجل الدخول لتحليل الملفات',
    },
    graph: {
      title: 'شبكة أمراض القلب والأوعية الدموية',
      legend: 'مستويات الخطر',
      status: 'حالة الرسم البياني',
      nodesLabel: 'العُقد',
      edgesLabel: 'الحواف',
      errorLabel: 'خطأ',
      neutralLabel: 'غير نشط',
      riskLevels: {
        high: 'خطر عالي',
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
      title: 'تنبؤات المخاطر',
      analyzing: 'جاري تحليل بيانات المريض...',
      runningModel: 'تشغيل نموذج التنبؤ GNN',
      noPredictions: 'ستظهر التنبؤات هنا بعد التحليل',
      probability: 'الاحتمالية',
      pathway: 'مسار التطور',
      riskLevel: 'مستوى الخطر',
      high: 'عالي',
      medium: 'متوسط',
      low: 'منخفض',
      reasoning: 'التفسير السريري',
      foundRiskFactors: 'تم العثور على {count} عامل خطر محتمل.',
    },
    diseases: {
      hypertension: 'ارتفاع ضغط الدم',
      sleep_apnea: 'انقطاع النفس النومي',
      heart_disease: 'أمراض القلب',
      stroke: 'سكتة دماغية',
      diabetes: 'السكري'
    },

    recommendations: {
      title: 'التوصيات المخصصة',
      noRecommendations: 'ستظهر التوصيات هنا بعد التحليل',
      types: {
        test: 'فحص طبي',
        lifestyle: 'نمط الحياة',
        prevention: 'الوقاية',
        diet: 'نصيحة غذائية',
      },
      priority: {
        high: 'أولوية عالية',
        medium: 'أولوية متوسطة',
        low: 'أولوية منخفضة',
      },
    },
    chat: {
      title: 'مساعد الذكاء الاصطناعي الطبي',
      subtitle: 'اشرح التنبؤات وعلاقات الرسم البياني',
      placeholder: 'اسأل عن نتائجك...',
      welcome: 'مرحباً! أنا مساعدك الطبي بالذكاء الاصطناعي. يمكنني مساعدتك في فهم تنبؤات الأمراض وشرح العلاقات في الرسم البياني الطبي وتقديم السياق للتوصيات. كيف يمكنني مساعدتك اليوم؟',
      typing: 'جاري التفكير...',
      send: 'إرسال',
      error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    },
    dashboard: {
      title: 'مخاطر الأمراض',
      subtitle: 'لوحة التحليل',
      graphTitle: 'رسم المعرفة الطبية',
      signInPrompt: 'سجل الدخول لحفظ تنبؤاتك وتتبع صحتك.',
      signIn: 'تسجيل الدخول',
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
      loginAccount: 'تسجيل الدخول',
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
    },
    footer: {
      rights: 'جميع الحقوق محفوظة',
      disclaimer: 'هذه أداة دعم القرار. استشر دائماً المتخصصين في الرعاية الصحية.',
      poweredBy: 'مدعوم بشبكات الرسم البياني العصبية',
    },
  },
};
