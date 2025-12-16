/* products.js */
const products = [
    { 
        id: 101, 
        name: 'Breitling Navitimer B01', 
        brand: 'Breitling',
        category: 'Aviation', 
        price: 780000, 
        rating: 5, 
        image: 'assets/images/navitimer_b01.webp', 
        description: 'The ultimate pilot\'s watch with a circular slide rule bezel for flight calculations.', 
        specs: { 'Movement': 'B01 Chronograph', 'Case': '43mm Steel', 'Bezel': 'Bidirectional' } 
    },
    { 
        id: 102, 
        name: 'Omega Speedmaster Moonwatch', 
        brand: 'Omega',
        category: 'Chronographs', 
        price: 650000, 
        rating: 4.8, 
        image: 'assets/images/speedmaster_moonwatch.webp', 
        description: 'The watch that went to the moon. A timeless chronograph with a manual-winding movement.', 
        specs: { 'Movement': 'Calibre 3861', 'Case': '42mm Steel', 'Crystal': 'Hesalite' } 
    },
    { 
        id: 103, 
        name: 'Hublot Big Bang Unico', 
        brand: 'Hublot',
        category: 'Sports Luxury', 
        price: 1800000, 
        rating: 4.5, 
        image: 'assets/images/big_bang_unico.webp', 
        description: 'A fusion of materials. Skeleton dial revealing the intricate column-wheel chronograph.', 
        specs: { 'Movement': 'HUB1280', 'Case': '42mm Ceramic', 'Strap': 'Rubber' } 
    },
    { 
        id: 104, 
        name: 'Patek Philippe Nautilus 5711', 
        brand: 'Patek Philippe',
        category: 'Sports Luxury', 
        price: 9500000, 
        rating: 4.9, 
        image: 'assets/images/nautilus_5711.webp', 
        description: 'The world\'s most desirable steel sports watch. Rounded octagonal shape and porthole construction.', 
        specs: { 'Movement': 'Caliber 26-330', 'Case': '40mm Steel', 'Complication': 'Date' } 
    },
    { 
        id: 105, 
        name: 'Cartier Tank Solo', 
        brand: 'Cartier',
        category: 'Dress Watches', 
        price: 320000, 
        rating: 4.6, 
        image: 'assets/images/tank_solo.webp', 
        description: 'Rectangular elegance inspired by WWI tanks. A classic dress watch for formal occasions.', 
        specs: { 'Movement': 'Quartz', 'Case': '31mm Steel', 'Strap': 'Leather' } 
    },
    { 
        id: 106, 
        name: 'Rolex Submariner Date', 
        brand: 'Rolex',
        category: 'Dive Watches', 
        price: 1250000, 
        rating: 4.9, 
        image: 'assets/images/submariner_date.webp', 
        description: 'The archetype of the modern diver\'s watch. Featuring a black dial and a rotatable bezel.', 
        specs: { 'Movement': 'Automatic 3235', 'Case': '41mm Steel', 'Water Resistance': '300m' } 
    },
    
    { 
        id: 107, 
        name: 'Omega Seamaster 300M', 
        brand: 'Omega',
        category: 'Dive Watches', 
        price: 495000, 
        rating: 4.8, 
        image: 'assets/images/seamaster_300m.webp', 
        description: 'Laser-engraved wave dial and ceramic bezel. Built for the depths of the ocean.', 
        specs: { 'Movement': 'Co-Axial Master', 'Case': '42mm Steel', 'Valve': 'Helium Escape' } 
    },
    { 
        id: 108, 
        name: 'Jaeger-LeCoultre Reverso Classic', 
        brand: 'Jaeger-LeCoultre',
        category: 'Dress Watches', 
        price: 850000, 
        rating: 4.7, 
        image: 'assets/images/reverso_classic.webp', 
        description: 'Legendary swivel case originally designed for polo players to protect the glass.', 
        specs: { 'Movement': 'Manual Winding', 'Case': 'Rectangular', 'Features': 'Dual Face' } 
    },
    { 
        id: 109, 
        name: 'Audemars Piguet Royal Oak Automatic', 
        brand: 'Audemars Piguet',
        category: 'Sports Luxury', 
        price: 3800000, 
        rating: 5.0, 
        image: 'assets/images/royal_oak_automatic.webp', 
        description: 'Iconic octagonal bezel with exposed screws. The definition of integrated bracelet luxury.', 
        specs: { 'Movement': 'Self-winding', 'Case': '41mm Rose Gold', 'Dial': 'Grande Tapisserie' } 
    },
    { 
        id: 110, 
        name: 'Panerai Luminor Marina', 
        brand: 'Panerai',
        category: 'Dive Watches', 
        price: 620000, 
        rating: 4.6, 
        image: 'assets/images/luminor_marina.webp', 
        description: 'Distinctive cushion shape and patented crown-protecting bridge.', 
        specs: { 'Movement': 'P.9010', 'Case': '44mm Steel', 'Lume': 'Sandwich Dial' } 
    },
    { 
        id: 111, 
        name: 'IWC Portugieser Chrono', 
        brand: 'IWC',
        category: 'Dress Watches', 
        price: 710000, 
        rating: 4.8, 
        image: 'assets/images/portugieser_chrono.webp', 
        description: 'Timeless design with slim feuille hands and applied Arabic numerals.', 
        specs: { 'Movement': 'Automatic', 'Case': '41mm Steel', 'Glass': 'Sapphire' } 
    },
    { 
        id: 112, 
        name: 'Rolex Daytona', 
        brand: 'Rolex',
        category: 'Chronographs', 
        price: 2800000, 
        rating: 4.9, 
        image: 'assets/images/daytona.webp', 
        description: 'The ultimate racing tool watch. Designed to meet the demands of professional drivers.', 
        specs: { 'Movement': 'Calibre 4130', 'Case': '40mm Steel', 'Bezel': 'Tachymetric' } 
    },
    { 
        id: 113, 
        name: 'Rolex Datejust 41', 
        brand: 'Rolex',
        category: 'Dress Watches', 
        price: 950000, 
        rating: 4.8, 
        image: 'assets/images/datejust_41.webp', 
        description: 'The classic watch of reference. Fluted bezel and jubilee bracelet.', 
        specs: { 'Movement': '3235', 'Case': '41mm Steel/Gold', 'Dial': 'Wimbledon' } 
    },
    { 
        id: 114, 
        name: 'Tudor Black Bay 58', 
        brand: 'Tudor',
        category: 'Dive Watches', 
        price: 320000, 
        rating: 4.7, 
        image: 'assets/images/black_bay_58.webp', 
        description: 'Vintage inspired diver with snowflake hands and rivet-style bracelet.', 
        specs: { 'Movement': 'MT5402', 'Case': '39mm Steel', 'Power Reserve': '70 Hours' } 
    },
    { 
        id: 115, 
        name: 'Cartier Santos de Cartier', 
        brand: 'Cartier',
        category: 'Sports Luxury', 
        price: 680000, 
        rating: 4.8, 
        image: 'assets/images/santos_de_cartier.webp', 
        description: 'The first modern wristwatch. Square case with visible screws and smartlink system.', 
        specs: { 'Movement': '1847 MC', 'Case': 'Medium Steel', 'Strap': 'Interchangeable' } 
    },
    { 
        id: 116, 
        name: 'Patek Philippe Aquanaut', 
        brand: 'Patek Philippe',
        category: 'Sports Luxury', 
        price: 6500000, 
        rating: 4.9, 
        image: 'assets/images/Aquanaut.webp', 
        description: 'Modern, sporty chic. Featuring a "tropical" strap made of a new composite material.', 
        specs: { 'Movement': '324 S C', 'Case': '40mm Steel', 'Water Resistance': '120m' } 
    }
];
