export const GOVERNORATES = [
    { id: 'jerusalem', name: 'Al-Quds (Jerusalem)', nameAr: 'القدس' },
    { id: 'hebron', name: 'Hebron', nameAr: 'الخليل' },
    { id: 'ramallah', name: 'Ramallah & Al-Bireh', nameAr: 'رام الله والبيرة' },
    { id: 'nablus', name: 'Nablus', nameAr: 'نابلس' },
    { id: 'jenin', name: 'Jenin', nameAr: 'جنين' },
    { id: 'bethlehem', name: 'Bethlehem', nameAr: 'بيت لحم' },
    { id: 'tulkarm', name: 'Tulkarm', nameAr: 'طولكرم' },
    { id: 'qalqilya', name: 'Qalqilya', nameAr: 'قلقيلية' },
    { id: 'tubas', name: 'Tubas', nameAr: 'طوباس' },
    { id: 'salfit', name: 'Salfit', nameAr: 'سلفيت' },
    { id: 'jericho', name: 'Jericho', nameAr: 'أريحا' },
    { id: 'gaza', name: 'Gaza Strip', nameAr: 'قطاع غزة' },
] as const;

export const OVERLAY_ASSETS: Record<string, { yellow: string; orange: string; red: string }> = {
    jerusalem: {
        yellow: '/images/overlays/jerusalem_yellow.png',
        orange: '/images/overlays/jerusalem_orange.png',
        red: '/images/overlays/jerusalem_red.png',
    },
    hebron: {
        yellow: '/images/overlays/hebron_yellow.png',
        orange: '/images/overlays/hebron_orange.png',
        red: '/images/overlays/hebron_red.png',
    },
    ramallah: {
        yellow: '/images/overlays/ramallah_yellow.png',
        orange: '/images/overlays/ramallah_orange.png',
        red: '/images/overlays/ramallah_red.png',
    },
    nablus: {
        yellow: '/images/overlays/nablus_yellow.png',
        orange: '/images/overlays/nablus_orange.png',
        red: '/images/overlays/nablus_red.png',
    },
    jenin: {
        yellow: '/images/overlays/jenin_yellow.png',
        orange: '/images/overlays/jenin_orange.png',
        red: '/images/overlays/jenin_red.png',
    },
    bethlehem: {
        yellow: '/images/overlays/bethlehem_yellow.png',
        orange: '/images/overlays/bethlehem_orange.png',
        red: '/images/overlays/bethlehem_red.png',
    },
    tulkarm: {
        yellow: '/images/overlays/tulkarm_yellow.png',
        orange: '/images/overlays/tulkarm_orange.png',
        red: '/images/overlays/tulkarm_red.png',
    },
    qalqilya: {
        yellow: '/images/overlays/qalqilya_yellow.png',
        orange: '/images/overlays/qalqilya_orange.png',
        red: '/images/overlays/qalqilya_red.png',
    },
    tubas: {
        yellow: '/images/overlays/tubas_yellow.png',
        orange: '/images/overlays/tubas_orange.png',
        red: '/images/overlays/tubas_red.png',
    },
    salfit: {
        yellow: '/images/overlays/salfit_yellow.png',
        orange: '/images/overlays/salfit_orange.png',
        red: '/images/overlays/salfit_red.png',
    },
    jericho: {
        yellow: '/images/overlays/jericho_yellow.png',
        orange: '/images/overlays/jericho_orange.png',
        red: '/images/overlays/jericho_red.png',
    },
    gaza: {
        yellow: '/images/overlays/gaza_yellow.png',
        orange: '/images/overlays/gaza_orange.png',
        red: '/images/overlays/gaza_red.png',
    },
};
