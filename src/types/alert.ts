export type AlertLevel = 'yellow' | 'orange' | 'red';
export type AlertStatus = 'draft' | 'issued' | 'cancelled';
export type SectorStatus = 'pending' | 'acknowledged' | 'inProgress' | 'completed';
export type HazardType = 'flood' | 'heatwave' | 'storm' | 'soil-moisture' | 'heavyRain' | 'coldWave' | 'wind';

export interface SectorResponse {
  role: string;
  status: SectorStatus;
  notes?: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  title: string;
  titleEn: string;
  hazardType: HazardType;
  level: AlertLevel;
  issueTime: string;
  validFrom: string;
  validTo: string;
  affectedAreas: string[];
  technicalDescAr: string;
  technicalDescEn: string;
  publicAdviceAr: string;
  publicAdviceEn: string;
  sectorRecommendations: {
    civilDefense?: string;
    agriculture?: string;
    water?: string;
    environment?: string;
    security?: string;
  };
  status: AlertStatus;
  sectorResponses: SectorResponse[];
  createdBy: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  role: string;
  action: string;
}

// Legend data for each hazard type and alert level
export const HAZARD_LEGENDS: Record<HazardType, Record<AlertLevel, { en: string; ar: string }>> = {
  flood: {
    yellow: {
      en: 'Moderate rainfall expected: 25-50mm. Minor flooding possible in low-lying areas.',
      ar: 'هطول أمطار متوسطة متوقعة: 25-50 ملم. احتمال حدوث فيضانات طفيفة في المناطق المنخفضة.'
    },
    orange: {
      en: 'Heavy rainfall expected: 50-100mm. Significant flooding likely. Avoid flood-prone areas.',
      ar: 'هطول أمطار غزيرة متوقعة: 50-100 ملم. احتمال كبير لحدوث فيضانات. تجنب المناطق المعرضة للفيضانات.'
    },
    red: {
      en: 'Very heavy rainfall expected: 100-150mm+. Severe flooding imminent. Evacuate flood zones immediately.',
      ar: 'هطول أمطار غزيرة جداً متوقعة: 100-150+ ملم. فيضانات شديدة وشيكة. أخلِ مناطق الفيضان فوراً.'
    }
  },
  heatwave: {
    yellow: {
      en: 'High temperatures expected: 35-38°C. Stay hydrated and avoid prolonged sun exposure.',
      ar: 'درجات حرارة مرتفعة متوقعة: 35-38 درجة مئوية. حافظ على الترطيب وتجنب التعرض المطول للشمس.'
    },
    orange: {
      en: 'Very high temperatures expected: 38-42°C. Limit outdoor activities. Vulnerable groups at risk.',
      ar: 'درجات حرارة مرتفعة جداً متوقعة: 38-42 درجة مئوية. قلل الأنشطة الخارجية. الفئات الضعيفة معرضة للخطر.'
    },
    red: {
      en: 'Extreme temperatures expected: 42°C+. Life-threatening heat. Stay indoors with cooling.',
      ar: 'درجات حرارة شديدة الارتفاع متوقعة: 42+ درجة مئوية. حرارة تهدد الحياة. ابقَ في الداخل مع التبريد.'
    }
  },
  storm: {
    yellow: {
      en: 'Moderate winds expected: 50-70 km/h. Secure loose objects outdoors.',
      ar: 'رياح متوسطة متوقعة: 50-70 كم/ساعة. أحكم ربط الأجسام المتحركة في الخارج.'
    },
    orange: {
      en: 'Strong winds expected: 70-100 km/h. Avoid outdoor activities. Potential structural damage.',
      ar: 'رياح قوية متوقعة: 70-100 كم/ساعة. تجنب الأنشطة الخارجية. احتمال أضرار هيكلية.'
    },
    red: {
      en: 'Severe storm winds expected: 100+ km/h. Seek shelter immediately. Major damage likely.',
      ar: 'رياح عاصفة شديدة متوقعة: 100+ كم/ساعة. اطلب المأوى فوراً. أضرار كبيرة محتملة.'
    }
  },
  'soil-moisture': {
    yellow: {
      en: 'Soil moisture below normal: 20-30%. Agricultural impact possible. Monitor irrigation needs.',
      ar: 'رطوبة التربة أقل من المعدل: 20-30%. تأثير زراعي محتمل. راقب احتياجات الري.'
    },
    orange: {
      en: 'Low soil moisture: 10-20%. Crop stress likely. Implement water conservation measures.',
      ar: 'رطوبة تربة منخفضة: 10-20%. إجهاد المحاصيل محتمل. طبق إجراءات الحفاظ على المياه.'
    },
    red: {
      en: 'Critical soil moisture: <10%. Severe crop failure risk. Emergency irrigation required.',
      ar: 'رطوبة تربة حرجة: أقل من 10%. خطر فشل المحاصيل الشديد. ري طارئ مطلوب.'
    }
  },
  heavyRain: {
    yellow: {
      en: 'Heavy rain expected: 20-40mm. Minor disruptions possible.',
      ar: 'أمطار غزيرة متوقعة: 20-40 ملم. اضطرابات طفيفة محتملة.'
    },
    orange: {
      en: 'Very heavy rain expected: 40-80mm. Significant disruptions likely.',
      ar: 'أمطار غزيرة جداً متوقعة: 40-80 ملم. اضطرابات كبيرة محتملة.'
    },
    red: {
      en: 'Extreme rainfall expected: 80mm+. Major disruptions and flooding imminent.',
      ar: 'أمطار شديدة الغزارة متوقعة: 80+ ملم. اضطرابات كبيرة وفيضانات وشيكة.'
    }
  },
  coldWave: {
    yellow: {
      en: 'Cold temperatures expected: 5-10°C. Protect vulnerable groups.',
      ar: 'درجات حرارة باردة متوقعة: 5-10 درجات مئوية. حماية الفئات الضعيفة.'
    },
    orange: {
      en: 'Very cold temperatures expected: 0-5°C. Risk of frost. Protect crops and livestock.',
      ar: 'درجات حرارة باردة جداً متوقعة: 0-5 درجات مئوية. خطر الصقيع. حماية المحاصيل والماشية.'
    },
    red: {
      en: 'Extreme cold expected: Below 0°C. Severe frost and freezing conditions. Emergency measures required.',
      ar: 'برد شديد متوقع: أقل من 0 درجة مئوية. صقيع شديد وظروف تجمد. تدابير طوارئ مطلوبة.'
    }
  },
  wind: {
    yellow: {
      en: 'Strong winds expected: 40-60 km/h. Secure loose items.',
      ar: 'رياح قوية متوقعة: 40-60 كم/ساعة. أمّن الأشياء المتحركة.'
    },
    orange: {
      en: 'Very strong winds expected: 60-90 km/h. Avoid outdoor activities.',
      ar: 'رياح قوية جداً متوقعة: 60-90 كم/ساعة. تجنب الأنشطة الخارجية.'
    },
    red: {
      en: 'Extreme winds expected: 90+ km/h. Life-threatening conditions. Seek shelter immediately.',
      ar: 'رياح شديدة القوة متوقعة: 90+ كم/ساعة. ظروف تهدد الحياة. اطلب المأوى فوراً.'
    }
  }
};
