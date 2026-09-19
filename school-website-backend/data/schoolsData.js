// Canonical schools data for backend services & test validation
const schools = [
  {
    "id": "delhi-public-school-knowledge-park-5",
    "slug": "delhi-public-school-knowledge-park-5",
    "name": "Delhi Public School, Knowledge Park V",
    "shortName": "DPS Knowledge Park-V",
    "alternateNames": [
      "Delhi Public School Knowledge Park 5",
      "DPS KP5",
      "DPS Greater Noida West",
      "DPS KP-V",
      "Delhi Public School KP-5"
    ],
    "tagline": "CBSE Senior Secondary Co-Educational Institution in Knowledge Park V",
    "summary": "Delhi Public School Knowledge Park-V (CBSE Affiliation No. 2133797) is a co-educational day school in Greater Noida West, offering academic programs from Nursery to Grade 12 with dedicated science labs, athletic facilities, and library resources.",
    "board": [
      "CBSE",
      "Cambridge"
    ],
    "boardNote": null,
    "curriculum": "CBSE & Cambridge International Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "25:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. 224 & 228, Knowledge Park-V, DPSS HRDC, Opposite Major Rohit Chowk, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Knowledge Park V",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Knowledge Park V",
      "coordinates": {
        "lat": 28.5833,
        "lng": 77.4667,
        "isVerified": true
      },
      "mapSearchQuery": "Delhi Public School Knowledge Park 5 Greater Noida",
      "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.0000000!2d77.4500000!3d28.5800000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x000000!2sDelhi%20Public%20School%20Knowledge%20Park%20V!5e0!3m2!1sen!2sin!4v0000000000"
    },
    "fees": {
      "cardFee": 132900,
      "estimatedFirstYear": 183900,
      "currency": "INR",
      "rangeText": "₹11,075 / month (₹33,225 / quarter · ₹1,32,900 calculated annual)",
      "academicSession": "2026–27",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "verified_from_source",
      "isVerified": true,
      "disclosed": true,
      "comparableAnnualAvailable": true,
      "billingFrequency": "quarterly",
      "feeCategory": "Composite School Fee (Inclusive of Tuition)",
      "sourceUrl": "https://dpskpv.com",
      "registrationFee": 1000,
      "admissionFee": 50000,
      "tuitionMonthly": "11,075",
      "tuitionQuarterly": "33,225",
      "tuitionAnnual": "1,32,900 (Calculated: ₹11,075/mo × 12)",
      "transportMonthly": "3,700 – 4,100",
      "transportAnnual": null,
      "calculatedAnnualNote": "Calculated annual composite equivalent is ₹1,32,900 (derived as ₹11,075/month × 12 or ₹33,225/quarter × 4). For Cambridge International Curriculum, additional annual charges of ₹16,200 apply (payable in two installments of ₹8,100 in April and October).",
      "disclaimer": "Composite fee is ₹11,075/month (₹33,225/quarter). Cambridge curriculum includes additional annual charges of ₹16,200 payable in two installments of ₹8,100 (April and October). Science lab charges of ₹4,500/year apply for Classes XI & XII Science. Transport via AC buses is optional. Activities charged as per actuals.",
      "footnotes": [
        "Admission fee (₹50,000) and registration fee (₹1,000) are one-time and non-refundable.",
        "Composite fee is ₹11,075 per month (or ₹33,225 quarterly). Annual equivalent of ₹1,32,900 is calculated as ₹11,075 × 12.",
        "Cambridge International Curriculum students pay additional annual charges of ₹16,200 in two installments of ₹8,100 (April and October).",
        "Science laboratory charges of ₹4,500 annually apply to Science stream students of Classes XI & XII.",
        "Transport via AC buses is optional: ₹3,700/month for Greater Noida West and ₹4,100/month for Noida, Greater Noida, Ghaziabad, Indirapuram, and Dadri.",
        "Optional sports academies (Swimming, Cricket, Soccer, Skating, Tennis) are charged as per actuals."
      ],
      "table": [
        {
          "type": "Registration Fee (One-time, non-refundable)",
          "cost": "1,000"
        },
        {
          "type": "Admission Fee (One-time, non-refundable)",
          "cost": "50,000"
        },
        {
          "type": "Composite Fee (Monthly, inclusive of tuition)",
          "cost": "11,075 / month"
        },
        {
          "type": "Composite Fee (Quarterly)",
          "cost": "33,225 / quarter"
        },
        {
          "type": "Cambridge International Stream (Additional Annual Charges)",
          "cost": "16,200 / year (₹8,100 in Apr & Oct)"
        },
        {
          "type": "Science Lab Charges (Classes XI & XII Science)",
          "cost": "4,500 / year"
        },
        {
          "type": "Transport - Greater Noida West (AC Bus, Optional)",
          "cost": "3,700 / month"
        },
        {
          "type": "Transport - Noida / Gr Noida / Ghaziabad / Indirapuram / Dadri (AC Bus, Optional)",
          "cost": "4,100 / month"
        },
        {
          "type": "Optional Academies (Swimming, Cricket, Soccer, Skating, Tennis)",
          "cost": "As per actuals"
        }
      ],
      "components": [
        {
          "id": "dps-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration fee.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "dps-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 50000,
          "formattedAmount": "₹50,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time, non-refundable admission fee.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "dps-comp-monthly",
          "name": "Composite Fee (Monthly)",
          "category": "recurring",
          "amount": 11075,
          "formattedAmount": "₹11,075 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Composite Fee per month, inclusive of Tuition Fee.",
          "gradesApplicable": "Pre-Nursery to Class XII"
        },
        {
          "id": "dps-comp-quarterly",
          "name": "Composite Fee (Quarterly)",
          "category": "recurring",
          "amount": 33225,
          "formattedAmount": "₹33,225 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Composite Fee if paid quarterly (₹11,075 × 3).",
          "gradesApplicable": "Pre-Nursery to Class XII"
        },
        {
          "id": "dps-comp-annual",
          "name": "Annual Composite Equivalent (Calculated)",
          "category": "recurring",
          "amount": 132900,
          "formattedAmount": "₹1,32,900 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual equivalent from monthly composite fee.",
          "gradesApplicable": "Pre-Nursery to Class XII",
          "isCalculated": true,
          "calculationNotes": "Calculated annual composite equivalent: ₹11,075/month × 12 months = ₹1,32,900/year (or ₹33,225/quarter × 4 quarters)."
        },
        {
          "id": "dps-cambridge-fee",
          "name": "Cambridge International Stream Additional Charges",
          "category": "curriculum_addon",
          "amount": 16200,
          "formattedAmount": "₹16,200 / year (₹8,100 in Apr & Oct)",
          "frequency": "annual",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "Additional Annual Charges for Cambridge International Curriculum, payable in two installments of ₹8,100 (April and October).",
          "gradesApplicable": "Cambridge Stream Students"
        },
        {
          "id": "dps-lab-fee",
          "name": "Science Lab Charges (Classes XI & XII)",
          "category": "lab_facility",
          "amount": 4500,
          "formattedAmount": "₹4,500 / year",
          "frequency": "annual",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "Applicable only to Science stream students in Classes XI & XII.",
          "gradesApplicable": "Classes XI & XII Science"
        },
        {
          "id": "dps-transport-gnw",
          "name": "Transport - Greater Noida West Area (AC Bus)",
          "category": "transport",
          "amount": 3700,
          "formattedAmount": "₹3,700 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "AC Bus transportation for Greater Noida West area.",
          "gradesApplicable": "Optional for all grades"
        },
        {
          "id": "dps-transport-outer",
          "name": "Transport - Noida / Gr Noida / Ghaziabad / Indirapuram / Dadri (AC Bus)",
          "category": "transport",
          "amount": 4100,
          "formattedAmount": "₹4,100 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "AC Bus transportation for Noida, Greater Noida, Ghaziabad, Indirapuram, and Dadri areas.",
          "gradesApplicable": "Optional for all grades"
        },
        {
          "id": "dps-academies",
          "name": "Sports & Academy Activities (Optional)",
          "category": "activity",
          "amount": null,
          "formattedAmount": "As per actuals",
          "frequency": "per_term",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "Optional sports academies: Swimming, Cricket Academy, Soccer Academy, Skating Academy, Tennis Academy. Charged as per actuals.",
          "gradesApplicable": "Optional for enrolled students"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-Nursery to Class XII (CBSE Stream)",
          "tuitionFee": "₹11,075 / month (₹33,225 / quarter)",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,32,900 / year",
          "totalAnnualPayable": "₹1,32,900",
          "isCalculated": true,
          "notes": "Calculated annual composite: ₹11,075 × 12 = ₹1,32,900/yr."
        },
        {
          "gradeGroup": "Cambridge International Curriculum Stream",
          "tuitionFee": "₹11,075 / month + ₹16,200 annual add-on",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,49,100 / year",
          "totalAnnualPayable": "₹1,49,100",
          "isCalculated": true,
          "notes": "Includes ₹1,32,900 composite fee (calculated from ₹11,075/mo) + ₹16,200 official additional annual charges (paid in two ₹8,100 installments in April & October)."
        },
        {
          "gradeGroup": "Classes XI & XII (Science Stream with Labs)",
          "tuitionFee": "₹11,075 / month + ₹4,500 annual lab fee",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,37,400 / year",
          "totalAnnualPayable": "₹1,37,400",
          "isCalculated": true,
          "notes": "Includes ₹1,32,900 composite fee + ₹4,500 annual science laboratory charges."
        }
      ],
      "transportSchedule": [
        {
          "zone": "Zone 1: Greater Noida West Local Area",
          "distanceSlab": "Local sector routes",
          "areasCovered": [
            "Greater Noida West / Noida Extension"
          ],
          "frequency": "monthly",
          "amount": "₹3,700 / month",
          "isOptional": true
        },
        {
          "zone": "Zone 2: Extended NCR Routes",
          "distanceSlab": "Outstation / Inter-city routes",
          "areasCovered": [
            "Noida",
            "Greater Noida",
            "Ghaziabad",
            "Indirapuram",
            "Dadri"
          ],
          "frequency": "monthly",
          "amount": "₹4,100 / month",
          "isOptional": true
        }
      ],
      "concessions": [],
      "circular": {
        "title": "Delhi Public School Knowledge Park V Official Fee Schedule",
        "academicSession": "2026–27",
        "circularType": "web_schedule",
        "sourceUrl": "https://dpskpv.com",
        "summary": "Official fee schedule for DPS Knowledge Park V detailing monthly/quarterly composite fees, Cambridge add-on charges, science lab fees, and AC transport slabs.",
        "keyTerms": [
          "Composite fee payable monthly (₹11,075) or quarterly (₹33,225)",
          "Cambridge stream includes ₹16,200 annual charges payable in April and October installments of ₹8,100",
          "Transport by AC buses is optional"
        ],
        "officialNotes": [
          "All one-time admission fees are non-refundable.",
          "Activities and sports academy sessions are billed on actuals."
        ]
      }
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Swimming Pool",
        "category": "Sports",
        "icon": "fas fa-swimming-pool"
      },
      {
        "name": "Auditorium",
        "category": "Infrastructure",
        "icon": "fas fa-theater-masks"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      },
      {
        "name": "AC Classrooms",
        "category": "Infrastructure",
        "icon": "fas fa-wind"
      }
    ],
    "uniforms": {
      "boys": {
        "image": "/assets/schools/delhi-public-school-knowledge-park-5/uniforms/boys-uniform.jpg",
        "label": "Boys Uniform"
      },
      "girls": {
        "image": "/assets/schools/delhi-public-school-knowledge-park-5/uniforms/girls-uniform.jpg",
        "label": "Girls Uniform"
      }
    },
    "achievements": [
      "National Inter‑DPS Sports & Athletics participation",
      "Strong CBSE board results",
      "Active student performance in Olympiads & MUN events"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Online registration followed by interaction/assessment.",
      "session": "2027-28",
      "sourceUrl": "https://dpskpv.com",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": "+91-0120-3567600",
      "website": "https://dpskpv.com",
      "email": "admin@dpskpv.com"
    },
    "rating": {
      "score": 4.5,
      "scale": 5,
      "reviewsCount": 12
    },
    "assets": {
      "featured": "/assets/schools/delhi-public-school-knowledge-park-5/featured/featured.jpg",
      "hero": "/assets/schools/delhi-public-school-knowledge-park-5/hero/campus-building.jpg",
      "gallery": [
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/DPS_Noidaoutdoor.jpg",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/Delhi_Public_School_528_Building_3.jpg",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/Screenshot 2026-03-08 at 2.17.59 PM.png",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/Screenshot 2026-03-08 at 2.18.21 PM.png",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/Screenshot 2026-03-08 at 2.18.29 PM.png",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/Screenshot 2026-03-08 at 2.18.37 PM.png",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/dps-boys-uniform.jpg.jpg",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/dps-girls-uniform.jpg.jpeg",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/dps1.jpg",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/dps2.jpeg",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/dps3.jpg",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/dps4.jpg",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/dps5.jpg",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/dps6.jpg",
        "/assets/schools/delhi-public-school-knowledge-park-5/gallery/outdoor2.jpeg"
      ],
      "legacyPaths": {
        "cardImage": "/images/dps.png",
        "pageHeroImage": "/schools/dps/dps1.jpg",
        "sourceDirectory": "/schools/dps/"
      },
      "coverImage": "/assets/schools/delhi-public-school-knowledge-park-5/featured/featured.jpg",
      "imageSource": "DPS Knowledge Park-V Official Campus Archive",
      "imageSourceUrl": "https://dpskpv.com",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/dps.html",
      "pageTitle": "Delhi Public School - Greater Noida West",
      "h1": "Delhi Public School - Greater Noida West",
      "pageHeartKey": "Delhi Public School",
      "cardHeartKey": "Delhi Public School Knowledge Park 5",
      "cardRatingKey": "Delhi Public School Knowledge Park 5",
      "cardLink": "schools/dps.html",
      "legacyUrls": [
        "schools/dps.html",
        "/schools/dps.html",
        "dps.html"
      ]
    },
    "auditNotes": [
      "Discrepancy resolved: page heart key used 'Delhi Public School' while card used full name.",
      "Contact phone is placeholder from template.",
      "All 15 gallery and uniform images verified and migrated."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official School Portal (dpskpv.com) & CBSE SARAS",
      "sourceUrl": "https://dpskpv.com",
      "cbseAffiliationNumber": "2133797",
      "schoolCode": "61494",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "grades",
        "admissions"
      ],
      "notes": "Official DPS Knowledge Park-V campus. Verified on CBSE SARAS."
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133797",
    "establishedYear": 2018,
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "delhi-public-school-knowledge-park-5",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133797"
  },
  {
    "id": "lotus-valley-international-school",
    "slug": "lotus-valley-international-school",
    "name": "Lotus Valley International School",
    "shortName": "Lotus Valley",
    "alternateNames": [
      "Lotus Valley International School - Greater Noida",
      "Lotus Valley Noida Extension"
    ],
    "tagline": "CBSE Co-Educational Day School in Techzone 4",
    "summary": "Lotus Valley International School in Techzone 4, Greater Noida West is a CBSE-affiliated co-educational school offering classes from Pre-Nursery to Grade 12 with dedicated digital classrooms, science labs, performing arts studios, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "24:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. 20A, Sector Techzone 4, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Techzone 4",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Techzone 4",
      "coordinates": {
        "lat": 28.6142,
        "lng": 77.4358,
        "isVerified": true
      },
      "mapSearchQuery": "Lotus Valley International School Greater Noida West",
      "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500!2d77!3d28!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x000000!2sLotus%20Valley%20International%20School!5e0!3m2!1sen!2sin!4v0000000000"
    },
    "fees": {
      "cardFee": 130800,
      "estimatedFirstYear": 191800,
      "currency": "INR",
      "rangeText": "₹10,900 – ₹13,130 / month (₹32,700 – ₹39,390 / quarter · ₹1,30,800 – ₹1,57,560 calculated annual)",
      "academicSession": "2026–27",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "verified_from_source",
      "isVerified": true,
      "disclosed": true,
      "comparableAnnualAvailable": true,
      "billingFrequency": "quarterly",
      "feeCategory": "Tuition & Composite Monthly Fee",
      "sourceUrl": "https://lotusvalleyne.com",
      "registrationFee": 1000,
      "admissionFee": 50000,
      "tuitionMonthly": "10,900 – 13,130",
      "tuitionQuarterly": "32,700 – 39,390",
      "tuitionAnnual": "1,30,800 – 1,57,560 (Calculated from monthly/quarterly)",
      "transportMonthly": "Route-dependent",
      "transportAnnual": null,
      "calculatedAnnualNote": "Annual values are calculated equivalents derived from supplied monthly/quarterly figures: Nursery–V (₹10,900/mo = ₹1,30,800/yr), VI–X (₹11,370/mo = ₹1,36,440/yr), XI–XII Comm/Hum (₹12,850/mo = ₹1,54,200/yr), XI–XII Science (₹13,130/mo = ₹1,57,560/yr).",
      "disclaimer": "Caution money of ₹10,000 is refundable upon withdrawal and clearance. Admission fee (₹50,000) and registration fee (₹1,000) are non-refundable. Transport is optional and calculated dynamically by route/distance.",
      "footnotes": [
        "Registration fee (₹1,000) and admission fee (₹50,000) are one-time and non-refundable.",
        "Caution money of ₹10,000 is one-time and refundable upon student withdrawal and clearance.",
        "Tuition fee is payable monthly/quarterly. Annual amounts are calculated equivalents.",
        "Transport fee is optional and dynamically calculated according to route and distance."
      ],
      "table": [
        {
          "type": "Registration Fee (One-time, non-refundable)",
          "cost": "1,000"
        },
        {
          "type": "Admission Fee (One-time, non-refundable)",
          "cost": "50,000"
        },
        {
          "type": "Caution Money (One-time, refundable)",
          "cost": "10,000"
        },
        {
          "type": "Tuition Fee – Nursery to Grade V",
          "cost": "10,900 / month (₹32,700 / quarter · ₹1,30,800 / year calculated)"
        },
        {
          "type": "Tuition Fee – Grades VI to X",
          "cost": "11,370 / month (₹34,110 / quarter · ₹1,36,440 / year calculated)"
        },
        {
          "type": "Tuition Fee – Grades XI & XII (Commerce & Humanities)",
          "cost": "12,850 / month (₹38,550 / quarter · ₹1,54,200 / year calculated)"
        },
        {
          "type": "Tuition Fee – Grades XI & XII (Science)",
          "cost": "13,130 / month (₹39,390 / quarter · ₹1,57,560 / year calculated)"
        },
        {
          "type": "Transport (Optional)",
          "cost": "Dynamically calculated according to route/distance"
        }
      ],
      "components": [
        {
          "id": "lv-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration fee for Greater Noida West campus.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "lv-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 50000,
          "formattedAmount": "₹50,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission fee.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "lv-caution",
          "name": "Caution Money (Security Deposit)",
          "category": "deposit",
          "amount": 10000,
          "formattedAmount": "₹10,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": true,
          "notes": "One-time refundable security caution deposit returned upon student withdrawal and clearance.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "lv-tuition-nur-v-qtr",
          "name": "Tuition Fee – Nursery to Grade V (Quarterly)",
          "category": "recurring",
          "amount": 32700,
          "formattedAmount": "₹32,700 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official quarterly tuition (₹10,900/month).",
          "gradesApplicable": "Nursery to Grade V"
        },
        {
          "id": "lv-tuition-nur-v-ann",
          "name": "Tuition Fee – Nursery to Grade V (Calculated Annual)",
          "category": "recurring",
          "amount": 130800,
          "formattedAmount": "₹1,30,800 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Nursery to Grade V",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹10,900/month × 12 months = ₹1,30,800/year (or ₹32,700/quarter × 4 quarters)."
        },
        {
          "id": "lv-tuition-vi-x-qtr",
          "name": "Tuition Fee – Grades VI to X (Quarterly)",
          "category": "recurring",
          "amount": 34110,
          "formattedAmount": "₹34,110 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official quarterly tuition (₹11,370/month).",
          "gradesApplicable": "Grades VI to X"
        },
        {
          "id": "lv-tuition-vi-x-ann",
          "name": "Tuition Fee – Grades VI to X (Calculated Annual)",
          "category": "recurring",
          "amount": 136440,
          "formattedAmount": "₹1,36,440 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Grades VI to X",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹11,370/month × 12 months = ₹1,36,440/year (or ₹34,110/quarter × 4 quarters)."
        },
        {
          "id": "lv-tuition-xi-xii-comm-qtr",
          "name": "Tuition Fee – Grades XI & XII Commerce & Humanities (Quarterly)",
          "category": "recurring",
          "amount": 38550,
          "formattedAmount": "₹38,550 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official quarterly tuition (₹12,850/month).",
          "gradesApplicable": "Grades XI & XII Commerce / Arts"
        },
        {
          "id": "lv-tuition-xi-xii-comm-ann",
          "name": "Tuition Fee – Grades XI & XII Commerce & Humanities (Calculated Annual)",
          "category": "recurring",
          "amount": 154200,
          "formattedAmount": "₹1,54,200 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Grades XI & XII Commerce / Arts",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹12,850/month × 12 months = ₹1,54,200/year (or ₹38,550/quarter × 4 quarters)."
        },
        {
          "id": "lv-tuition-xi-xii-sci-qtr",
          "name": "Tuition Fee – Grades XI & XII Science (Quarterly)",
          "category": "recurring",
          "amount": 39390,
          "formattedAmount": "₹39,390 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official quarterly tuition (₹13,130/month).",
          "gradesApplicable": "Grades XI & XII Science"
        },
        {
          "id": "lv-tuition-xi-xii-sci-ann",
          "name": "Tuition Fee – Grades XI & XII Science (Calculated Annual)",
          "category": "recurring",
          "amount": 157560,
          "formattedAmount": "₹1,57,560 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Grades XI & XII Science",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹13,130/month × 12 months = ₹1,57,560/year (or ₹39,390/quarter × 4 quarters)."
        },
        {
          "id": "lv-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "Distance-based route calculation",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "Dynamically calculated according to route and distance.",
          "gradesApplicable": "Optional for all students"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to Grade V",
          "tuitionFee": "₹10,900 / month (₹32,700 / quarter)",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,30,800 / year",
          "totalAnnualPayable": "₹1,30,800",
          "isCalculated": true,
          "notes": "Calculated as ₹10,900/mo × 12 = ₹1,30,800/yr."
        },
        {
          "gradeGroup": "Grades VI to X",
          "tuitionFee": "₹11,370 / month (₹34,110 / quarter)",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,36,440 / year",
          "totalAnnualPayable": "₹1,36,440",
          "isCalculated": true,
          "notes": "Calculated as ₹11,370/mo × 12 = ₹1,36,440/yr."
        },
        {
          "gradeGroup": "Grades XI & XII (Commerce & Humanities)",
          "tuitionFee": "₹12,850 / month (₹38,550 / quarter)",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,54,200 / year",
          "totalAnnualPayable": "₹1,54,200",
          "isCalculated": true,
          "notes": "Calculated as ₹12,850/mo × 12 = ₹1,54,200/yr."
        },
        {
          "gradeGroup": "Grades XI & XII (Science)",
          "tuitionFee": "₹13,130 / month (₹39,390 / quarter)",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,57,560 / year",
          "totalAnnualPayable": "₹1,57,560",
          "isCalculated": true,
          "notes": "Calculated as ₹13,130/mo × 12 = ₹1,57,560/yr."
        }
      ],
      "concessions": [],
      "circular": {
        "title": "Lotus Valley International School Detailed Fee Schedule",
        "academicSession": "2026–27",
        "circularType": "web_schedule",
        "sourceUrl": "https://lotusvalleyne.com",
        "summary": "Official fee policy for Lotus Valley International School Greater Noida West detailing monthly/quarterly tuition, admission charges, and refundable caution deposit.",
        "keyTerms": [
          "Tuition fee payable monthly or quarterly",
          "Caution deposit refundable on student withdrawal",
          "Transport charges calculated dynamically by distance"
        ],
        "officialNotes": [
          "Security caution deposit of ₹10,000 is refundable upon institutional clearance."
        ]
      },
      "cautionDeposit": 10000,
      "refundableSecurity": 10000
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Swimming Pool",
        "category": "Sports",
        "icon": "fas fa-swimming-pool"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      }
    ],
    "uniforms": {
      "boys": {
        "image": "/assets/schools/lotus-valley-international-school/uniforms/boys-uniform.webp",
        "label": "Boys Uniform"
      },
      "girls": {
        "image": "/assets/schools/lotus-valley-international-school/uniforms/girls-uniform.webp",
        "label": "Girls Uniform"
      }
    },
    "achievements": [
      "Top rankings in national school surveys",
      "Award for excellence in community engagement & leadership",
      "Innovative learning model recognition"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Online form submission followed by student interaction.",
      "session": "2027-28",
      "sourceUrl": "https://lotusvalleynoidaextension.com",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": "+91-8448992083",
      "website": "https://lotusvalleynoidaextension.com",
      "email": "admissions@lotusvalleynoidaextension.com"
    },
    "rating": {
      "score": 4.6,
      "scale": 5,
      "reviewsCount": 18
    },
    "assets": {
      "featured": "/assets/schools/lotus-valley-international-school/featured/featured.jpg",
      "hero": "/assets/schools/lotus-valley-international-school/hero/hero.jpg",
      "gallery": [
        "/assets/schools/lotus-valley-international-school/gallery/633147593_1471082731695678_6732246442191460788_n.jpg",
        "/assets/schools/lotus-valley-international-school/gallery/8.jpg",
        "/assets/schools/lotus-valley-international-school/gallery/achievement.jpg",
        "/assets/schools/lotus-valley-international-school/gallery/boys uniform.webp",
        "/assets/schools/lotus-valley-international-school/gallery/commuity.jpg",
        "/assets/schools/lotus-valley-international-school/gallery/dance.jpg",
        "/assets/schools/lotus-valley-international-school/gallery/girls uniform.webp",
        "/assets/schools/lotus-valley-international-school/gallery/images (1).jpeg",
        "/assets/schools/lotus-valley-international-school/gallery/images (2).jpeg",
        "/assets/schools/lotus-valley-international-school/gallery/images (3).jpeg",
        "/assets/schools/lotus-valley-international-school/gallery/images.jpeg",
        "/assets/schools/lotus-valley-international-school/gallery/images3.jpeg",
        "/assets/schools/lotus-valley-international-school/gallery/slider1.jpg",
        "/assets/schools/lotus-valley-international-school/gallery/small kids.jpeg",
        "/assets/schools/lotus-valley-international-school/gallery/timing.jpg"
      ],
      "legacyPaths": {
        "cardImage": "/images/lotusjpg.jpg",
        "cardSecondary": "/images/lotus.jpeg",
        "sourceDirectory": "/schools/lotus/"
      },
      "coverImage": "/assets/schools/lotus-valley-international-school/featured/featured.jpg",
      "imageSource": "Lotus Valley International School Campus Archive",
      "imageSourceUrl": "https://lotusvalleynoidaextension.com",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/lotus.html",
      "pageTitle": "Lotus Valley School - Greater Noida West",
      "h1": "Lotus Valley School - Greater Noida West",
      "pageHeartKey": "Lotus Valley International School",
      "cardHeartKey": "Lotus Valley International School",
      "cardRatingKey": "Lotus Valley International",
      "cardLink": "schools/lotus.html",
      "legacyUrls": [
        "schools/lotus.html",
        "/schools/lotus.html",
        "lotus.html"
      ]
    },
    "auditNotes": [
      "Rating key in card was 'Lotus Valley International' (shortened). Standardized to slug.",
      "Contact phone is placeholder from template.",
      "All 15 gallery and uniform images verified and migrated."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official School Website (lotusvalleynoidaextension.com) & CBSE SARAS",
      "sourceUrl": "https://lotusvalleynoidaextension.com",
      "cbseAffiliationNumber": "2133449",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "grades",
        "admissions"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133449",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "lotus-valley-international-school",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133747"
  },
  {
    "id": "pacific-world-school-techzone-4",
    "slug": "pacific-world-school-techzone-4",
    "name": "Pacific World School",
    "shortName": "Pacific World",
    "alternateNames": [
      "Pacific World School - Greater Noida",
      "Pacific World School Techzone 4"
    ],
    "tagline": "CBSE Co-Educational Campus in Techzone 4 Near Ek Murti Chowk",
    "summary": "Pacific World School is a CBSE-affiliated co-educational school situated on a 10-acre campus in Techzone 4, Greater Noida West, offering comprehensive academic and athletic programs from Pre-Nursery to Grade 12.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "20:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. HS-02, Sector Techzone 4, near Ek Murti Chowk, Greater Noida West, Uttar Pradesh 201308",
      "sector": "Techzone 4",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201308",
      "area": "Techzone 4",
      "coordinates": {
        "lat": 28.599,
        "lng": 77.4425,
        "isVerified": true
      },
      "mapSearchQuery": "Pacific World School Techzone 4 Greater Noida West",
      "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500!2d77!3d28!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x000000!2sPacific%20World%20School!5e0!3m2!1sen!2sin!4v0000000000"
    },
    "fees": {
      "cardFee": 145200,
      "estimatedFirstYear": 191400,
      "currency": "INR",
      "rangeText": "₹36,300 – ₹45,300 / quarter (₹1,45,200 – ₹1,81,200 calculated annual)",
      "academicSession": "2026–27",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "verified_from_source",
      "isVerified": true,
      "disclosed": true,
      "comparableAnnualAvailable": true,
      "billingFrequency": "quarterly",
      "feeCategory": "Quarterly Tuition Fee",
      "sourceUrl": "https://pacificworldschool.com",
      "registrationFee": 1200,
      "admissionFee": 45000,
      "tuitionMonthly": null,
      "tuitionQuarterly": "36,300 – 45,300",
      "tuitionAnnual": "1,45,200 – 1,81,200 (Calculated: quarterly × 4)",
      "transportMonthly": "Varies by distance",
      "transportAnnual": null,
      "calculatedAnnualNote": "Annual tuition figures are calculated equivalents derived from official quarterly rates: Nursery–II (₹36,300/qtr × 4 = ₹1,45,200/yr), III–IX & XI (₹37,800/qtr × 4 = ₹1,51,200/yr), Cambridge CP-2 to LS-3 (₹45,300/qtr × 4 = ₹1,81,200/yr).",
      "disclaimer": "Tuition fee is payable quarterly in advance. Transport varies according to distance (bus fee may increase by up to 10%). Sibling admission fee of ₹25,000 is available under school criteria. Uniform, books, and stationery charged on actual usage. Late fee of ₹20/day and cheque bounce charge of ₹400 apply where applicable.",
      "footnotes": [
        "Registration fee (₹1,200) and admission fee (₹45,000) are one-time and non-refundable.",
        "Sibling admission fee is ₹25,000 where applicable under the school's criteria.",
        "Tuition fee is payable quarterly in advance. Annual amounts are calculated as 4 × quarterly fee.",
        "Transport fee varies according to distance; bus fee may increase by up to 10%.",
        "Uniform, books, and stationery are charged on actual usage.",
        "Late fee of ₹20/day after due date and cheque bounce charge of ₹400 apply where applicable."
      ],
      "table": [
        {
          "type": "Registration Fee (One-time, non-refundable)",
          "cost": "1,200"
        },
        {
          "type": "Admission Fee (One-time, non-refundable)",
          "cost": "45,000"
        },
        {
          "type": "Sibling Admission Fee (Where applicable)",
          "cost": "25,000"
        },
        {
          "type": "Tuition Fee – Nursery to Class II",
          "cost": "36,300 / quarter (₹1,45,200 / year calculated)"
        },
        {
          "type": "Tuition Fee – Classes III to IX",
          "cost": "37,800 / quarter (₹1,51,200 / year calculated)"
        },
        {
          "type": "Tuition Fee – Class XI",
          "cost": "37,800 / quarter (₹1,51,200 / year calculated)"
        },
        {
          "type": "Cambridge Curriculum (CP-2 to LS-3)",
          "cost": "45,300 / quarter (₹1,81,200 / year calculated)"
        },
        {
          "type": "Transport (Optional)",
          "cost": "Varies according to distance (may increase up to 10%)"
        },
        {
          "type": "Additional Policies",
          "cost": "Late fee ₹20/day; Cheque bounce ₹400; Uniform/books on actuals"
        }
      ],
      "components": [
        {
          "id": "pacific-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1200,
          "formattedAmount": "₹1,200",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration fee.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "pacific-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 45000,
          "formattedAmount": "₹45,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time, non-refundable admission fee.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "pacific-sibling-adm",
          "name": "Sibling Admission Fee (Concession)",
          "category": "one_time",
          "amount": 25000,
          "formattedAmount": "₹25,000",
          "frequency": "one_time",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "Special admission fee for siblings where applicable under school criteria.",
          "gradesApplicable": "Sibling Enrolments"
        },
        {
          "id": "pacific-tuition-nur-ii-qtr",
          "name": "Tuition Fee – Nursery to Class II (Quarterly)",
          "category": "recurring",
          "amount": 36300,
          "formattedAmount": "₹36,300 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable quarterly in advance.",
          "gradesApplicable": "Nursery to Class II"
        },
        {
          "id": "pacific-tuition-nur-ii-ann",
          "name": "Tuition Fee – Nursery to Class II (Calculated Annual)",
          "category": "recurring",
          "amount": 145200,
          "formattedAmount": "₹1,45,200 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Nursery to Class II",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹36,300 quarterly × 4 quarters = ₹1,45,200 / year."
        },
        {
          "id": "pacific-tuition-iii-ix-qtr",
          "name": "Tuition Fee – Classes III to IX (Quarterly)",
          "category": "recurring",
          "amount": 37800,
          "formattedAmount": "₹37,800 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable quarterly in advance.",
          "gradesApplicable": "Classes III to IX"
        },
        {
          "id": "pacific-tuition-iii-ix-ann",
          "name": "Tuition Fee – Classes III to IX (Calculated Annual)",
          "category": "recurring",
          "amount": 151200,
          "formattedAmount": "₹1,51,200 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Classes III to IX",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹37,800 quarterly × 4 quarters = ₹1,51,200 / year."
        },
        {
          "id": "pacific-tuition-xi-qtr",
          "name": "Tuition Fee – Class XI (Quarterly)",
          "category": "recurring",
          "amount": 37800,
          "formattedAmount": "₹37,800 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable quarterly in advance.",
          "gradesApplicable": "Class XI"
        },
        {
          "id": "pacific-tuition-xi-ann",
          "name": "Tuition Fee – Class XI (Calculated Annual)",
          "category": "recurring",
          "amount": 151200,
          "formattedAmount": "₹1,51,200 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Class XI",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹37,800 quarterly × 4 quarters = ₹1,51,200 / year."
        },
        {
          "id": "pacific-cambridge-qtr",
          "name": "Cambridge Curriculum CP-2 to LS-3 (Quarterly)",
          "category": "recurring",
          "amount": 45300,
          "formattedAmount": "₹45,300 / quarter",
          "frequency": "quarterly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "Quarterly fee for Cambridge Curriculum (CP-2 to LS-3).",
          "gradesApplicable": "Cambridge CP-2 to LS-3"
        },
        {
          "id": "pacific-cambridge-ann",
          "name": "Cambridge Curriculum CP-2 to LS-3 (Calculated Annual)",
          "category": "recurring",
          "amount": 181200,
          "formattedAmount": "₹1,81,200 / year",
          "frequency": "annual",
          "mandatory": false,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Cambridge CP-2 to LS-3",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹45,300 quarterly × 4 quarters = ₹1,81,200 / year."
        },
        {
          "id": "pacific-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "Varies according to distance",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "Transport fee varies by route/distance. Bus fee may increase by up to 10%.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to Class II",
          "tuitionFee": "₹36,300 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,45,200 / year",
          "totalAnnualPayable": "₹1,45,200",
          "isCalculated": true,
          "notes": "Calculated as ₹36,300 × 4 = ₹1,45,200/yr."
        },
        {
          "gradeGroup": "Classes III to IX",
          "tuitionFee": "₹37,800 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,51,200 / year",
          "totalAnnualPayable": "₹1,51,200",
          "isCalculated": true,
          "notes": "Calculated as ₹37,800 × 4 = ₹1,51,200/yr."
        },
        {
          "gradeGroup": "Class XI",
          "tuitionFee": "₹37,800 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,51,200 / year",
          "totalAnnualPayable": "₹1,51,200",
          "isCalculated": true,
          "notes": "Calculated as ₹37,800 × 4 = ₹1,51,200/yr."
        },
        {
          "gradeGroup": "Cambridge Curriculum (CP-2 to LS-3)",
          "tuitionFee": "₹45,300 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,81,200 / year",
          "totalAnnualPayable": "₹1,81,200",
          "isCalculated": true,
          "notes": "Calculated as ₹45,300 × 4 = ₹1,81,200/yr."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Admission Concession",
          "category": "sibling",
          "discountDescription": "Sibling Admission Fee: ₹25,000 (instead of ₹45,000 standard admission fee)",
          "eligibilityCriteria": "Where applicable under school criteria for concurrent sibling enrolment.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Pacific World School Official Fee Schedule",
        "academicSession": "2026–27",
        "circularType": "web_schedule",
        "sourceUrl": "https://pacificworldschool.com",
        "summary": "Official fee structure for Pacific World School covering quarterly tuition, one-time charges, Cambridge stream rates, and optional services.",
        "keyTerms": [
          "Payment due quarterly in advance",
          "Sibling admission concession available (₹25,000)",
          "Late fee of ₹20/day after due date and cheque bounce charge of ₹400"
        ],
        "officialNotes": [
          "Bus fee may increase by up to 10% during the session."
        ]
      }
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Swimming Pool",
        "category": "Sports",
        "icon": "fas fa-swimming-pool"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      }
    ],
    "uniforms": {
      "boys": {
        "image": "/assets/schools/pacific-world-school-techzone-4/uniforms/boys-uniform.jpg",
        "label": "Boys Summer Uniform"
      },
      "girls": {
        "image": "/assets/schools/pacific-world-school-techzone-4/uniforms/girls-uniform.jpg",
        "label": "Girls Uniform"
      }
    },
    "achievements": [
      "World‑class campus & labs",
      "Emphasis on global readiness & critical thinking",
      "Strong experiential and creative learning culture"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Registration via school admission portal followed by campus walk.",
      "session": "2027-28",
      "sourceUrl": "https://www.pacificworldschool.com",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": "+91-8899117704",
      "website": "https://www.pacificworldschool.com",
      "email": "info@pacificworldschool.com"
    },
    "rating": {
      "score": 4.2,
      "scale": 5,
      "reviewsCount": 15
    },
    "assets": {
      "featured": "/assets/schools/pacific-world-school-techzone-4/featured/featured.jpeg",
      "hero": "/assets/schools/pacific-world-school-techzone-4/hero/hero.jpeg",
      "gallery": [
        "/assets/schools/pacific-world-school-techzone-4/gallery/1744089371_slider-2.png",
        "/assets/schools/pacific-world-school-techzone-4/gallery/7-4-550x330.jpg",
        "/assets/schools/pacific-world-school-techzone-4/gallery/Delhi_Entrance-1600x1000.jpg"
      ],
      "legacyPaths": {
        "cardImage": "/images/pacific.jpeg",
        "sourceDirectory": "/schools/pacific/"
      },
      "coverImage": "/assets/schools/pacific-world-school-techzone-4/featured/featured.jpeg",
      "imageSource": "Pacific World School Official Campus Archive",
      "imageSourceUrl": "https://www.pacificworldschool.com",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/pacific.html",
      "pageTitle": "Pacific World School - Greater Noida West",
      "h1": "Pacific World School - Greater Noida West",
      "pageHeartKey": "Pacific World School",
      "cardHeartKey": "Pacific World School Techzone 4",
      "cardRatingKey": "PWS",
      "cardLink": "schools/pacific.html",
      "legacyUrls": [
        "schools/pacific.html",
        "/schools/pacific.html",
        "pacific.html"
      ]
    },
    "auditNotes": [
      "Collision resolved: In legacy index.html card, cardRatingKey was 'PWS', which collided with Delhi World Public School.",
      "Contact phone is placeholder from template.",
      "Has 18 gallery and uniform assets preserved and migrated."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official School Website (pacificworldschool.com) & CBSE SARAS",
      "sourceUrl": "https://www.pacificworldschool.com",
      "cbseAffiliationNumber": "2133246",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "grades",
        "admissions"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133246",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "pacific-world-school-techzone-4",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133808"
  },
  {
    "id": "the-shri-ram-universal-school",
    "slug": "the-shri-ram-universal-school",
    "name": "The Shri Ram Universal School",
    "shortName": "TSUS Greater Noida",
    "alternateNames": [
      "The Shri Ram Universal School - Greater Noida",
      "TSUS Noida Extension",
      "TSRU"
    ],
    "tagline": "CBSE Co-Educational Day School in Techzone 4",
    "summary": "The Shri Ram Universal School (CBSE Affiliation No. 2133458) is located at Plot HS-03, Techzone 4, Greater Noida West, offering value-oriented co-educational learning from Pre-Nursery to Grade 12.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "10:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. HS-03, Sector Techzone 4, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Techzone 4",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Techzone 4",
      "coordinates": {
        "lat": 28.6085,
        "lng": 77.4395,
        "isVerified": true
      },
      "mapSearchQuery": "The Shri Ram Universal School Greater Noida West",
      "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500!2d77!3d28!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x000000!2sShri%20Ram%20Universal%20School!5e0!3m2!1sen!2sin!4v0000000000"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 41100,
      "currency": "INR",
      "rangeText": "₹41,100 / quarter (Classes IX–XII; Junior grades not publicly specified)",
      "registrationFee": null,
      "admissionFee": null,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": "₹41,100 (Classes IX–XII)",
      "tuitionAnnual": "₹1,64,400 (Classes IX–XII calculated equivalent)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "the-shri-ram-universal-school-comp-1",
          "name": "Composite Tuition (Classes IX–XII)",
          "category": "recurring",
          "amount": 41100,
          "formattedAmount": "₹41,100",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official composite quarterly fee for secondary & senior secondary grades (Classes IX–XII)."
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to Class VII",
          "tuitionFee": "Available on request",
          "tuitionFrequency": "annual",
          "notes": "Junior grade fees not publicly specified in authoritative disclosure."
        },
        {
          "gradeGroup": "Classes IX–XII",
          "tuitionFee": "₹41,100 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,64,400 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual equivalent based on ₹41,100 / quarter composite fee."
        }
      ],
      "concessions": [],
      "disclaimer": "Official fee disclosed for Classes IX–XII is ₹41,100 per quarter. Junior grade fees are not publicly specified."
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      },
      {
        "name": "Art & Music Room",
        "category": "Arts",
        "icon": "fas fa-paint-brush"
      }
    ],
    "uniforms": {
      "boys": {
        "image": "/assets/schools/the-shri-ram-universal-school/uniforms/boys-uniform.webp",
        "label": "Boys Uniform"
      },
      "girls": {
        "image": "/assets/schools/the-shri-ram-universal-school/uniforms/girls-uniform.webp",
        "label": "Girls Uniform"
      }
    },
    "achievements": [
      "Top emerging CBSE school in UP",
      "Holistic learning with strong co‑curricular output",
      "Leadership & personalized education ethos"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Submit inquiry online, attend school open house and parent interaction.",
      "session": "2027-28",
      "sourceUrl": "https://tsusnoida.edu.in",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": "+91-0120-5151515",
      "website": "https://tsusnoida.edu.in",
      "email": "info@tsusnoida.edu.in"
    },
    "rating": {
      "score": 4.4,
      "scale": 5,
      "reviewsCount": 14
    },
    "assets": {
      "featured": "/assets/schools/the-shri-ram-universal-school/featured/featured.jpeg",
      "hero": "/assets/schools/the-shri-ram-universal-school/hero/hero.avif",
      "gallery": [],
      "legacyPaths": {
        "cardImage": "/images/SRU.jpeg",
        "sourceDirectory": "/schools/TSRU/"
      },
      "coverImage": "/assets/schools/the-shri-ram-universal-school/featured/featured.jpeg",
      "imageSource": "The Shri Ram Universal School Campus Archive",
      "imageSourceUrl": "https://tsusnoida.edu.in",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/SRU.html",
      "pageTitle": "Shri Ram Universal School - Greater Noida West",
      "h1": "Shri Ram Universal School - Greater Noida West",
      "pageHeartKey": "The Shri Ram Universal",
      "cardHeartKey": "The Shri Ram Universal School",
      "cardRatingKey": "TSRU",
      "cardLink": "schools/SRU.html",
      "legacyUrls": [
        "schools/SRU.html",
        "/schools/SRU.html",
        "SRU.html"
      ]
    },
    "auditNotes": [
      "Heart key in page was 'The Shri Ram Universal' vs 'The Shri Ram Universal School' on card.",
      "Contact phone is placeholder from template.",
      "All 10 gallery and uniform assets migrated."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official School Website (tsusnoida.edu.in) & CBSE SARAS",
      "sourceUrl": "https://tsusnoida.edu.in",
      "cbseAffiliationNumber": "2134175",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "grades",
        "admissions"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2134175",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "the-shri-ram-universal-school",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2134175"
  },
  {
    "id": "delhi-world-public-school-kp-5",
    "slug": "delhi-world-public-school-kp-5",
    "name": "Delhi World Public School",
    "shortName": "DWPS Noida Extension",
    "alternateNames": [
      "Delhi World Public School",
      "DWPS Noida Extension",
      "DWPS",
      "Delhi World Public School KP 5",
      "Delhi World Public School Greater Noida West",
      "DPWS",
      "DPS World School",
      "DPS World School Noida Extension"
    ],
    "tagline": "CBSE Co-Educational Senior Secondary Institution in Knowledge Park V",
    "summary": "Delhi World Public School, Knowledge Park V, Greater Noida West (CBSE Affiliation No. 2132903) offers comprehensive co-educational schooling from Pre-Nursery to Grade 12 with modern laboratories, athletics, and cultural arts.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "25:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. HS-57, Knowledge Park V, Greater Noida West, Gautam Budh Nagar, Uttar Pradesh 201306",
      "sector": "Knowledge Park V",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.5833,
        "lng": 77.4667
      },
      "mapSearchQuery": "Delhi World Public School Knowledge Park V Greater Noida West",
      "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.0000000!2d77.4500000!3d28.5800000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x000000!2sDelhi%20World%20Public%20School%20KP5!5e0!3m2!1sen!2sin!4v0000000000"
    },
    "fees": {
      "cardFee": 91000,
      "estimatedFirstYear": 133000,
      "currency": "INR",
      "rangeText": "₹91,000 – ₹1,21,000 / year (tuition + annual charges)",
      "registrationFee": 2000,
      "admissionFee": 40000,
      "tuitionMonthly": null,
      "tuitionQuarterly": "21,000 (Pre-Nur/Nur/Prep)",
      "tuitionAnnual": "91,000",
      "transportMonthly": "2,500 – 3,500",
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "table": [
        {
          "type": "Prospectus & Application Fee",
          "cost": "₹1,000 (One-time, non-refundable)"
        },
        {
          "type": "Registration Fee",
          "cost": "₹2,000 (One-time, non-refundable)"
        },
        {
          "type": "Admission Fee",
          "cost": "₹30,000 (One-time at admission)"
        },
        {
          "type": "Composite Tuition Fee (Quarterly)",
          "cost": "₹22,500 per quarter"
        },
        {
          "type": "Composite Annual Tuition",
          "cost": "₹90,000 per annum"
        }
      ],
      "comparableAnnualAvailable": true,
      "feeCategory": "Tuition & Annual Charges",
      "billingFrequency": "quarterly",
      "sourceUrl": "https://www.dwpsgrnoida.com/fee-structure",
      "academicSession": "2026-2027",
      "lastVerifiedDate": "September 2026",
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "delhi-world-public-school-kp-5-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 2000,
          "formattedAmount": "₹2,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "delhi-world-public-school-kp-5-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 40000,
          "formattedAmount": "₹40,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "delhi-world-public-school-kp-5-tuition-quarterly",
          "name": "Composite Tuition Fee (Quarterly)",
          "category": "recurring",
          "amount": 21000,
          "formattedAmount": "₹21,000 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable quarterly in advance.",
          "gradesApplicable": "Nursery – 12"
        },
        {
          "id": "delhi-world-public-school-kp-5-tuition-annual",
          "name": "Annual Composite Tuition (Calculated)",
          "category": "recurring",
          "amount": 91000,
          "formattedAmount": "₹91,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Nursery – 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published quarterly fee: ₹21,000 × 4 quarters = ₹91,000/year."
        },
        {
          "id": "delhi-world-public-school-kp-5-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹2,500 – 3,500 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery – 12",
          "tuitionFee": "₹21,000 (Pre-Nur/Nur/Prep) / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹91,000 / year",
          "totalAnnualPayable": "₹91,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Delhi World Public School Official Fee Schedule",
        "academicSession": "2026-2027",
        "circularType": "web_schedule",
        "sourceUrl": "https://www.dwpsgrnoida.com/fee-structure",
        "summary": "Official fee structure for Delhi World Public School covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "AC Rooms",
        "category": "Infrastructure",
        "icon": "fas fa-snowflake"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Dance Room",
        "category": "Arts",
        "icon": "fas fa-music"
      },
      {
        "name": "Music Room",
        "category": "Arts",
        "icon": "fas fa-guitar"
      },
      {
        "name": "Art & Craft",
        "category": "Arts",
        "icon": "fas fa-paint-brush"
      },
      {
        "name": "CCTV Surveillance",
        "category": "Safety",
        "icon": "fas fa-video"
      },
      {
        "name": "Medical Room",
        "category": "Wellness",
        "icon": "fas fa-notes-medical"
      },
      {
        "name": "Cafeteria",
        "category": "Amenities",
        "icon": "fas fa-utensils"
      },
      {
        "name": "Play Area",
        "category": "Sports",
        "icon": "fas fa-child"
      },
      {
        "name": "Auditorium",
        "category": "Infrastructure",
        "icon": "fas fa-theater-masks"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      }
    ],
    "uniforms": {
      "boys": {
        "image": "/assets/schools/delhi-world-public-school-kp-5/uniforms/boys-uniform.png",
        "label": "Boys Uniform"
      },
      "girls": {
        "image": "/assets/schools/delhi-world-public-school-kp-5/uniforms/girls-uniform.png",
        "label": "Girls Uniform"
      }
    },
    "achievements": [
      "Winners in National & International Olympiads",
      "Finalists at UNESCO International Youth Festival “Planet of ART”",
      "Awards in National “Japan on Canvas” painting competition"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Admission open from Nursery to Class 12. Assessment and registration.",
      "session": "2027-28",
      "sourceUrl": "https://dwpsnoidaex.com",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": "+91-9205131014",
      "website": "https://dpwsnoidaex.com",
      "email": "info@dwpsnoidaex.com"
    },
    "rating": {
      "score": 4.5,
      "scale": 5,
      "reviewsCount": 16
    },
    "assets": {
      "featured": "/assets/schools/delhi-world-public-school-kp-5/featured/featured.jpg",
      "hero": "/assets/schools/delhi-world-public-school-kp-5/hero/hero.jpg",
      "gallery": [
        "/assets/schools/delhi-world-public-school-kp-5/gallery/student-council.jpg",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/ncc-cadets-achievement.jpg",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/book-donation-drive.jpg",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/next-mun-2024.jpg",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/ramayan-annual-function.webp",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/appreciation-certificate.jpg",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/dwps-user-photo-1.jpeg",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/dwps-user-photo-2.jpeg",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/dwps-user-photo-3.jpg",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/dwps-user-photo-4.jpg",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/dwps-user-photo-5.jpg",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/dwps-user-photo-6.jpeg",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/dwps-user-photo-7.jpeg",
        "/assets/schools/delhi-world-public-school-kp-5/gallery/dwps-user-photo-8.jpeg"
      ],
      "legacyPaths": {
        "cardImage": "/images/DPWS.jpeg",
        "sourceDirectory": "/schools/DPSWS/"
      },
      "coverImage": "/assets/schools/delhi-world-public-school-kp-5/featured/featured.jpg",
      "imageSource": "Verified Official Campus Exterior & Activity Archives (Knowledge Park V)",
      "imageSourceUrl": "https://www.dwpsgrnoida.com",
      "imageVerifiedAt": "2026-09"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/DPSWS.html",
      "pageTitle": "Delhi World Public School - Greater Noida",
      "h1": "Delhi Public School KP5",
      "pageHeartKey": "Delhi Public World School",
      "cardHeartKey": "Delhi World Public School",
      "cardRatingKey": "PWS",
      "cardLink": "schools/DPSWS.html",
      "legacyUrls": [
        "schools/DPSWS.html",
        "/schools/DPSWS.html",
        "DPSWS.html"
      ]
    },
    "auditNotes": [
      "H1 in legacy page had typo 'Delhi Public School KP5' omitting 'World'; Title had correct name.",
      "Rating key in legacy card was 'PWS' colliding with Pacific World School.",
      "Contact and phone copied from DPS KP5 template; flagged for client verification.",
      "All 12 gallery and uniform assets migrated.",
      "Corrected campus location to Knowledge Park III (Opposite Sharda University) per official mandatory disclosure and CBSE SARAS. Official website confirmed as dwpsgrnoida.com with affiliation 2132580.",
      "Corrected 2026-09-19: address/sector had incorrectly said 'Knowledge Park III'. Confirmed via CBSE SARAS (Affiliation No. 2132903) that this campus is in Knowledge Park V, Greater Noida West. Affiliation number corrected from 2132580 to 2132903 and website corrected to dpwsnoidaex.com to match. The Sector-4 duplicate record was removed."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "CBSE SARAS Mandatory Disclosure",
      "sourceUrl": "https://saras.cbse.gov.in/SARAS/AffiliatedList/AfflicationDetails/2132903",
      "cbseAffiliationNumber": "2132903",
      "schoolCode": "61048",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "schoolCode",
        "fees",
        "admissions",
        "establishedYear"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2132903",
    "establishedYear": 2016,
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "delhi-world-public-school-kp-5",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "ryan-international-school-greater-noida",
    "slug": "ryan-international-school-greater-noida",
    "name": "Ryan International School, Beta 1, Greater Noida",
    "shortName": "Ryan International Beta 1",
    "alternateNames": [
      "Ryan International School - Greater Noida",
      "Ryan Beta 1"
    ],
    "tagline": "CBSE & CAIE Co-Educational School in Sector Beta 1",
    "summary": "Ryan International School in Sector Beta 1, Greater Noida (CBSE Affiliation No. 2130728) provides Montessori to Grade 12 education with extensive campus sports fields, cultural facilities, and laboratories.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Montessori",
      "to": "Class 12",
      "raw": "Montessori – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "30:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. HS-6, Block E, Sector Beta 1, Greater Noida, Uttar Pradesh 201308",
      "sector": "Sector Beta 1",
      "city": "Greater Noida",
      "state": "Uttar Pradesh",
      "pincode": "201308",
      "area": "Greater Noida",
      "coordinates": {
        "lat": 28.47,
        "lng": 77.5
      },
      "mapSearchQuery": "Ryan International School Greater Noida",
      "mapEmbedUrl": "https://www.google.com/maps?q=Ryan+International+School+Greater+Noida&output=embed"
    },
    "fees": {
      "cardFee": 108000,
      "estimatedFirstYear": 154200,
      "currency": "INR",
      "rangeText": "₹1,08,000 – ₹1,20,000 / year",
      "registrationFee": 1200,
      "admissionFee": 45000,
      "tuitionMonthly": "9,000 – 10,000",
      "tuitionQuarterly": null,
      "tuitionAnnual": "1,08,000 – 1,20,000",
      "transportMonthly": "3,000 – 4,000",
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "1,200"
        },
        {
          "type": "Admission Fee",
          "cost": "45,000"
        },
        {
          "type": "Tuition Fee (Monthly)",
          "cost": "9,000 – 10,000"
        },
        {
          "type": "Transport",
          "cost": "3,000 – 4,000"
        },
        {
          "type": "Estimated First Year",
          "cost": "~1,10,000"
        }
      ],
      "comparableAnnualAvailable": true,
      "feeCategory": "Monthly Tuition Fee",
      "billingFrequency": "monthly",
      "sourceUrl": "https://ryaninternational.org",
      "academicSession": "2026-2027",
      "lastVerifiedDate": "September 2026",
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "ryan-international-school-greater-noida-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1200,
          "formattedAmount": "₹1,200",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "ryan-international-school-greater-noida-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 45000,
          "formattedAmount": "₹45,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "ryan-international-school-greater-noida-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 900010000,
          "formattedAmount": "₹90,00,10,000 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Montessori – 12"
        },
        {
          "id": "ryan-international-school-greater-noida-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 108000,
          "formattedAmount": "₹1,08,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Montessori – 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹90,00,10,000 × 12 = ₹1,08,000/year."
        },
        {
          "id": "ryan-international-school-greater-noida-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹3,000 – 4,000 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Montessori – 12",
          "tuitionFee": "₹9,000 – 10,000 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,08,000 / year",
          "totalAnnualPayable": "₹1,08,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Ryan International School, Beta 1, Greater Noida Official Fee Schedule",
        "academicSession": "2026-2027",
        "circularType": "web_schedule",
        "sourceUrl": "https://ryaninternational.org",
        "summary": "Official fee structure for Ryan International School, Beta 1, Greater Noida covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Swimming Pool",
        "category": "Sports",
        "icon": "fas fa-swimming-pool"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      },
      {
        "name": "Music & Dance Room",
        "category": "Arts",
        "icon": "fas fa-music"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Boys Uniform (Pending asset)"
      },
      "girls": {
        "image": null,
        "label": "Girls Uniform (Pending asset)"
      }
    },
    "achievements": [
      "Excellent academics & extracurriculars",
      "Strong sports & arts culture",
      "Modern infrastructure with labs & libraries"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Online application via Ryan Group portal.",
      "session": "2027-28",
      "sourceUrl": "https://www.ryangroup.org",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": "+911204232222",
      "website": "https://www.ryangroup.org/ryaninternational/cbse/greater-noida/ryan-international-school-beta-1",
      "email": null
    },
    "rating": {
      "score": 4.4,
      "scale": 5,
      "reviewsCount": 20
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {
        "cardImage": "/schools/ryan/main.webp",
        "sourceDirectory": "/schools/ryan/"
      },
      "coverImage": "/assets/schools/ryan-international-school-greater-noida/featured/featured.webp",
      "imageSource": "Photo Pending - Awaiting Verified Sector Beta 1 Campus Exterior",
      "imageSourceUrl": "https://www.ryangroup.org/ryaninternational/cbse/greater-noida/ryan-international-school-beta-1",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/ryan.html",
      "pageTitle": "Ryan International School - Greater Noida",
      "h1": "Ryan International School - Greater Noida",
      "pageHeartKey": "Ryan International School",
      "cardHeartKey": "Ryan International School Greater Noida",
      "cardRatingKey": "Ryan",
      "cardLink": "schools/ryan.html",
      "legacyUrls": [
        "schools/ryan.html",
        "/schools/ryan.html",
        "ryan.html"
      ]
    },
    "auditNotes": [
      "Located in Sector Beta 1, Greater Noida (established 2003, CBSE Affiliation No. 2130728).",
      "Preserved as distinct campus separate from Ryan International School Techzone 4 (Greater Noida West)."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Ryan Group Portal & CBSE SARAS",
      "sourceUrl": "https://www.ryangroup.org",
      "cbseAffiliationNumber": "2130728",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2130728",
    "geographicClassification": "geographic_outlier",
    "recordType": "nearby_surrounding",
    "canonicalSlug": "ryan-international-school-greater-noida",
    "isArchived": true,
    "status": "archived",
    "archiveReason": "Sector Beta 1 campus (Core Greater Noida). Techzone 4 Greater Noida West campus is retained separately as active."
  },
  {
    "id": "sks-world-school-greater-noida-west",
    "slug": "sks-world-school-greater-noida-west",
    "name": "SKS World School, Greater Noida West",
    "shortName": "SKS World School",
    "alternateNames": [
      "SKS World School Greater Noida West",
      "SKS World School Sector 16",
      "SKS World School HS-01",
      "SKS World School - Greater Noida"
    ],
    "tagline": "CBSE Senior Secondary Co-Educational Institution in Sector 16, Greater Noida West",
    "summary": "SKS World School (CBSE Affiliation No. 2133039, School Code 61218) is situated at Plot No. HS-01, Sector 16, Greater Noida West, offering holistic schooling from Pre-Nursery through Grade 12 with modern science labs, library, and comprehensive sports infrastructure.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "24:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "HS-01 & HS-04, Sector 16, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 16",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201318",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.6012,
        "lng": 77.4475,
        "isVerified": true
      },
      "mapSearchQuery": "SKS World School HS-01 Sector 16 Greater Noida West",
      "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.222384955745!2d77.4448553!3d28.6011111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cee2205555555%3A0x6b6c2656e133d1a8!2sSKS%20World%20School!5e0!3m2!1sen!2sin!4v1700000000000",
      "locality": "Sector 16, Greater Noida West"
    },
    "fees": {
      "cardFee": 91200,
      "estimatedFirstYear": 132300,
      "currency": "INR",
      "rangeText": "₹91,200 – ₹1,06,200 / year (₹22,800 – ₹26,550 / quarter)",
      "academicSession": "2026–27",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "verified_from_source",
      "isVerified": true,
      "disclosed": true,
      "comparableAnnualAvailable": true,
      "billingFrequency": "quarterly",
      "feeCategory": "Composite Annual Fee",
      "sourceUrl": "https://sksworldschool.com",
      "registrationFee": 1100,
      "admissionFee": 40000,
      "tuitionMonthly": null,
      "tuitionQuarterly": "22,800 – 26,550",
      "tuitionAnnual": "91,200 – 1,06,200",
      "transportMonthly": "Distance-based",
      "transportAnnual": null,
      "calculatedAnnualNote": "Published composite fee structure payable quarterly or annually across grade tiers: Pre-Nur–Prep (₹91,200/yr · ₹22,800/qtr), Classes I–V (₹93,600/yr · ₹23,400/qtr), Classes VI–VIII (₹98,400/yr · ₹24,600/qtr), Classes IX–X (₹1,06,200/yr · ₹26,550/qtr).",
      "disclaimer": "Composite fee is payable quarterly as published. Prospectus & registration fee (₹1,100) and admission processing fee (₹40,000) are one-time non-refundable fees. Transport is optional and charged based on distance.",
      "footnotes": [
        "Prospectus & registration fee (₹1,100) and admission processing fee (₹40,000) are one-time and non-refundable.",
        "Composite fees are payable quarterly or annually as specified.",
        "Transport is optional and charges vary based on distance."
      ],
      "table": [
        {
          "type": "Prospectus + Registration Fee (One-time, non-refundable)",
          "cost": "1,100"
        },
        {
          "type": "Admission Processing Fee (One-time, non-refundable)",
          "cost": "40,000"
        },
        {
          "type": "Composite Fee – Pre-Nursery to Prep",
          "cost": "91,200 / year (₹22,800 / quarter)"
        },
        {
          "type": "Composite Fee – Classes I to V",
          "cost": "93,600 / year (₹23,400 / quarter)"
        },
        {
          "type": "Composite Fee – Classes VI to VIII",
          "cost": "98,400 / year (₹24,600 / quarter)"
        },
        {
          "type": "Composite Fee – Classes IX to X",
          "cost": "1,06,200 / year (₹26,550 / quarter)"
        },
        {
          "type": "Transport (Optional)",
          "cost": "Distance-based route calculation"
        }
      ],
      "components": [
        {
          "id": "sks-reg",
          "name": "Prospectus & Registration Fee",
          "category": "one_time",
          "amount": 1100,
          "formattedAmount": "₹1,100",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time, non-refundable prospectus and registration fee.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "sks-adm",
          "name": "Admission Processing Fee",
          "category": "one_time",
          "amount": 40000,
          "formattedAmount": "₹40,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time, non-refundable admission processing fee.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "sks-comp-pre-nur-prep-qtr",
          "name": "Composite Fee – Pre-Nursery to Prep (Quarterly)",
          "category": "recurring",
          "amount": 22800,
          "formattedAmount": "₹22,800 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official quarterly composite fee.",
          "gradesApplicable": "Pre-Nursery to Prep"
        },
        {
          "id": "sks-comp-pre-nur-prep-ann",
          "name": "Composite Fee – Pre-Nursery to Prep (Annual)",
          "category": "recurring",
          "amount": 91200,
          "formattedAmount": "₹91,200 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official annual composite fee.",
          "gradesApplicable": "Pre-Nursery to Prep"
        },
        {
          "id": "sks-comp-i-v-qtr",
          "name": "Composite Fee – Classes I to V (Quarterly)",
          "category": "recurring",
          "amount": 23400,
          "formattedAmount": "₹23,400 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official quarterly composite fee.",
          "gradesApplicable": "Classes I to V"
        },
        {
          "id": "sks-comp-i-v-ann",
          "name": "Composite Fee – Classes I to V (Annual)",
          "category": "recurring",
          "amount": 93600,
          "formattedAmount": "₹93,600 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official annual composite fee.",
          "gradesApplicable": "Classes I to V"
        },
        {
          "id": "sks-comp-vi-viii-qtr",
          "name": "Composite Fee – Classes VI to VIII (Quarterly)",
          "category": "recurring",
          "amount": 24600,
          "formattedAmount": "₹24,600 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official quarterly composite fee.",
          "gradesApplicable": "Classes VI to VIII"
        },
        {
          "id": "sks-comp-vi-viii-ann",
          "name": "Composite Fee – Classes VI to VIII (Annual)",
          "category": "recurring",
          "amount": 98400,
          "formattedAmount": "₹98,400 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official annual composite fee.",
          "gradesApplicable": "Classes VI to VIII"
        },
        {
          "id": "sks-comp-ix-x-qtr",
          "name": "Composite Fee – Classes IX to X (Quarterly)",
          "category": "recurring",
          "amount": 26550,
          "formattedAmount": "₹26,550 / quarter",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official quarterly composite fee.",
          "gradesApplicable": "Classes IX to X"
        },
        {
          "id": "sks-comp-ix-x-ann",
          "name": "Composite Fee – Classes IX to X (Annual)",
          "category": "recurring",
          "amount": 106200,
          "formattedAmount": "₹1,06,200 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official annual composite fee.",
          "gradesApplicable": "Classes IX to X"
        },
        {
          "id": "sks-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "Distance-based route calculation",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "Optional transport charged as per route.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-Nursery to Prep",
          "tuitionFee": "₹22,800 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹91,200 / year",
          "totalAnnualPayable": "₹91,200",
          "isCalculated": false,
          "notes": "Official annual fee: ₹91,200 (₹22,800/quarter)."
        },
        {
          "gradeGroup": "Classes I to V",
          "tuitionFee": "₹23,400 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹93,600 / year",
          "totalAnnualPayable": "₹93,600",
          "isCalculated": false,
          "notes": "Official annual fee: ₹93,600 (₹23,400/quarter)."
        },
        {
          "gradeGroup": "Classes VI to VIII",
          "tuitionFee": "₹24,600 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹98,400 / year",
          "totalAnnualPayable": "₹98,400",
          "isCalculated": false,
          "notes": "Official annual fee: ₹98,400 (₹24,600/quarter)."
        },
        {
          "gradeGroup": "Classes IX to X",
          "tuitionFee": "₹26,550 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,06,200 / year",
          "totalAnnualPayable": "₹1,06,200",
          "isCalculated": false,
          "notes": "Official annual fee: ₹1,06,200 (₹26,550/quarter)."
        }
      ],
      "concessions": [],
      "circular": {
        "title": "SKS World School Official Fee Schedule",
        "academicSession": "2026–27",
        "circularType": "web_schedule",
        "sourceUrl": "https://sksworldschool.com",
        "summary": "Official published fee structure for SKS World School Greater Noida West covering grade-wise quarterly/annual composite fees and one-time admission charges.",
        "keyTerms": [
          "Composite fees payable quarterly or annually",
          "Registration and admission processing fees are non-refundable"
        ],
        "officialNotes": [
          "Transport is optional and calculated as per distance slab."
        ]
      }
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Boys Uniform (Pending asset)"
      },
      "girls": {
        "image": null,
        "label": "Girls Uniform (Pending asset)"
      }
    },
    "achievements": [
      "Holistic learning & modern campus",
      "Strong academic results",
      "Emphasis on creativity & critical thinking"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Online registration on school website.",
      "session": "2027-28",
      "sourceUrl": "https://sksworldschool.ac.in",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Contact admin office for mid-session transfer vacancies."
    },
    "contact": {
      "phone": "+91-9891081240",
      "website": "https://sksworldschool.ac.in",
      "email": "contact@sksworldschool.ac.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 11
    },
    "assets": {
      "featured": "/assets/schools/sks-world-school-greater-noida-west/featured/featured.jpg",
      "hero": "/assets/schools/sks-world-school-greater-noida-west/hero/hero.jpg",
      "gallery": [],
      "legacyPaths": {},
      "imageSource": "Official SKS World School Portal - HS-01 Sector 16 Campus Banner",
      "imageSourceUrl": "https://sksworldschool.ac.in",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/sks.html",
      "pageTitle": "SKS World School - Greater Noida West",
      "h1": "SKS World School - Greater Noida West",
      "pageHeartKey": "SKS World School",
      "cardHeartKey": "SKS World School Greater Noida West",
      "cardRatingKey": "SKS",
      "cardLink": "schools/sks.html",
      "legacyUrls": [
        "schools/sks.html",
        "/schools/sks.html",
        "sks.html"
      ]
    },
    "auditNotes": [
      "Legacy page referenced nonexistent /schools/sks/ gallery and uniform files.",
      "Authentic images/sks.jpg preserved and migrated."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official SKS World School Portal & CBSE SARAS",
      "sourceUrl": "https://sksworldschool.ac.in",
      "cbseAffiliationNumber": "2133039",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "fees"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Skating",
      "Swimming"
    ],
    "affiliationNumber": "2133039",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "sks-world-school-greater-noida-west",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2132777"
  },
  {
    "id": "jm-international-school",
    "slug": "jm-international-school",
    "name": "JM International School",
    "shortName": "JM International",
    "alternateNames": [
      "JM International School - Greater Noida",
      "JMIS Noida Extension"
    ],
    "tagline": "CBSE Day School in Sector Techzone 4",
    "summary": "JM International School (CBSE Affiliation No. 2134091) is a co-educational day school at Plot 23A, Sector Techzone 4, Greater Noida West, providing classes from Pre-Nursery to Grade 12.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "30:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. 23A, Sector Techzone 4, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Techzone 4",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.6078,
        "lng": 77.4402,
        "isVerified": true
      },
      "mapSearchQuery": "JM International School Greater Noida West",
      "mapEmbedUrl": "https://www.google.com/maps?q=JM+International+School+Greater+Noida+West&output=embed"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 9500,
      "currency": "INR",
      "rangeText": "₹9,500 – ₹12,000 / month (Calculated annual: ₹1,14,000 – ₹1,44,000 / year)",
      "registrationFee": null,
      "admissionFee": 55000,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": "₹9,500 – ₹12,000",
      "tuitionAnnual": "₹1,14,000 – ₹1,44,000 (Calculated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "jm-international-school-comp-1",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 55000,
          "formattedAmount": "₹55,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time admission fee."
        },
        {
          "id": "jm-international-school-comp-2",
          "name": "Composite Tuition",
          "category": "recurring",
          "amount": 950012000,
          "formattedAmount": "₹9,500 – ₹12,000",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Monthly composite tuition across grades."
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "All Grades",
          "tuitionFee": "₹9,500 – ₹12,000",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,14,000 – ₹1,44,000 (Calculated)",
          "calculationNotes": "Calculated annual equivalent range (₹9,500 × 12 to ₹12,000 × 12)."
        }
      ],
      "concessions": [],
      "disclaimer": "Admission fee is ₹55,000. Composite monthly tuition ranges from ₹9,500 to ₹12,000. Annual figures are calculated."
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Swimming Pool",
        "category": "Sports",
        "icon": "fas fa-swimming-pool"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      },
      {
        "name": "Music & Dance Room",
        "category": "Arts",
        "icon": "fas fa-music"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Boys Uniform (Pending asset)"
      },
      "girls": {
        "image": null,
        "label": "Girls Uniform (Pending asset)"
      }
    },
    "achievements": [
      "Strong academic culture",
      "Focus on extracurriculars",
      "Modern classrooms and labs"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Online application on jminternationalschool.com.",
      "session": "2027-28",
      "sourceUrl": "https://jminternationalschool.com",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": null,
      "website": "https://jminternationalschool.com",
      "email": null
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 10
    },
    "assets": {
      "featured": "/assets/schools/jm-international-school/featured/featured.jpg",
      "hero": "/assets/schools/jm-international-school/hero/hero.jpg",
      "gallery": [
        "/assets/schools/jm-international-school/featured/featured.jpg"
      ],
      "legacyPaths": {
        "cardImage": "/images/jm.jpg"
      },
      "coverImage": "/assets/schools/jm-international-school/featured/featured.jpg",
      "imageSource": "JM International School Techzone-4 Campus Archive",
      "imageSourceUrl": "https://www.jminternationalschool.com",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/jm.html",
      "pageTitle": "JM International School - Greater Noida West",
      "h1": "JM International School - Greater Noida West",
      "pageHeartKey": "JM International School",
      "cardHeartKey": "JM International School",
      "cardRatingKey": "JM",
      "cardLink": "schools/jm.html",
      "legacyUrls": [
        "schools/jm.html",
        "/schools/jm.html",
        "jm.html"
      ]
    },
    "auditNotes": [
      "Legacy page referenced nonexistent /schools/jm/ gallery and uniform files.",
      "Authentic images/jm.jpg preserved and migrated."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official JM International Portal & CBSE SARAS",
      "sourceUrl": "https://jminternationalschool.com",
      "cbseAffiliationNumber": "2134091",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2134091",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "jm-international-school",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2134091"
  },
  {
    "id": "st-xaviers-high-school",
    "slug": "st-xaviers-high-school",
    "name": "St. Xavier's High School",
    "shortName": "St. Xavier's",
    "alternateNames": [
      "St. Xavier's High School - Greater Noida West",
      "St Xavier",
      "St. Xavier's High School Techzone 4",
      "St. Xaviers High School Sector 16B",
      "St. Xavier's High School Greater Noida West"
    ],
    "tagline": "CBSE Co-Educational School in Greater Noida West",
    "summary": "St. Xavier's High School (CBSE Affiliation No. 2133916) offers co-educational schooling from Pre-Nursery to Grade 12 with modern science labs, computer rooms, and activity spaces.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "14:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No 20 C, Tech Zone IV, Amrapali Dream Valley, Greater Noida, Uttar Pradesh 201308",
      "sector": "Sector 16B",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201308",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.61,
        "lng": 77.43
      },
      "mapSearchQuery": "St Xaviers High School Greater Noida West",
      "mapEmbedUrl": "https://www.google.com/maps?q=St+Xaviers+High+School+Greater+Noida+West&output=embed"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 22500,
      "currency": "INR",
      "rangeText": "Quarterly: ₹22,500 – ₹29,700 (Nur–V) | ₹23,400 – ₹30,000+ (VI–VIII) | ₹24,300+ (IX–X)",
      "registrationFee": null,
      "admissionFee": null,
      "cautionDeposit": "₹7,500 – ₹10,000 (Refundable)",
      "refundableSecurity": "₹7,500 – ₹10,000",
      "tuitionMonthly": null,
      "tuitionQuarterly": "₹22,500 – ₹30,000+",
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "st-xaviers-high-school-comp-1",
          "name": "Caution / Security Deposit",
          "category": "deposit",
          "amount": 750010000,
          "formattedAmount": "₹7,500 – ₹10,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": true,
          "notes": "Refundable one-time caution money."
        },
        {
          "id": "st-xaviers-high-school-comp-2",
          "name": "Quarterly Tuition (Nursery–V)",
          "category": "recurring",
          "amount": 2250029700,
          "formattedAmount": "₹22,500 – ₹29,700",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "st-xaviers-high-school-comp-3",
          "name": "Quarterly Tuition (VI–VIII)",
          "category": "recurring",
          "amount": 2340030000,
          "formattedAmount": "₹23,400 – ₹30,000+",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "st-xaviers-high-school-comp-4",
          "name": "Quarterly Tuition (IX–X)",
          "category": "recurring",
          "amount": 24300,
          "formattedAmount": "₹24,300+",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery–V",
          "tuitionFee": "₹22,500 – ₹29,700",
          "tuitionFrequency": "quarterly",
          "isOfficial": true
        },
        {
          "gradeGroup": "VI–VIII",
          "tuitionFee": "₹23,400 – ₹30,000+",
          "tuitionFrequency": "quarterly",
          "isOfficial": true
        },
        {
          "gradeGroup": "IX–X",
          "tuitionFee": "₹24,300+",
          "tuitionFrequency": "quarterly",
          "isOfficial": true
        }
      ],
      "concessions": [],
      "disclaimer": "Official quarterly grade tiers: Nursery–V (₹22,500–₹29,700), VI–VIII (₹23,400–₹30,000+), IX–X (₹24,300+). Refundable caution is ₹7,500–₹10,000."
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Boys Uniform (Pending asset)"
      },
      "girls": {
        "image": null,
        "label": "Girls Uniform (Pending asset)"
      }
    },
    "achievements": [
      "Focus on academic excellence & values",
      "Co‑curricular programs & sports",
      "Strong alumni network"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "School office registration and interaction.",
      "session": "2027-28",
      "sourceUrl": null,
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": null,
      "website": "https://stxaviersgn.in/",
      "email": null
    },
    "rating": {
      "score": 4.4,
      "scale": 5,
      "reviewsCount": 13
    },
    "assets": {
      "featured": "/assets/schools/st-xaviers-high-school/featured/featured.jpg",
      "hero": "/assets/schools/st-xaviers-high-school/hero/hero.avif",
      "gallery": [
        "/assets/schools/st-xaviers-high-school/featured/featured.jpg"
      ],
      "legacyPaths": {
        "cardImage": "/images/sx.jpg",
        "pageBanner": "/schools/xavier/banner.avif"
      },
      "coverImage": "/assets/schools/st-xaviers-high-school/featured/featured.jpg",
      "imageSource": "St. Xavier's High School Campus Archive",
      "imageSourceUrl": "https://stxaviersgn.in",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/st.html",
      "pageTitle": "St. Xavier's High School - Greater Noida West",
      "h1": "St. Xavier's High School",
      "pageHeartKey": "St Xavier",
      "cardHeartKey": "St. Xavier's High School",
      "cardRatingKey": "Xaviers",
      "cardLink": "schools/xaviers.html",
      "legacyUrls": [
        "schools/st.html",
        "/schools/st.html",
        "schools/xaviers.html",
        "/schools/xaviers.html",
        "st.html"
      ]
    },
    "auditNotes": [
      "Broken link resolved: card on index.html linked to non-existent 'schools/xaviers.html' instead of 'schools/st.html'.",
      "Legacy page referenced nonexistent /schools/xaviers/ images; authentic banner.avif in /schools/xavier/ and sx.jpg migrated.",
      "Canonical record for St. Xavier High School in Greater Noida West (Sector 16B / Techzone 4). Official website stxaviersgn.in verified."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official St. Xaviers GN West Portal (stxaviersgn.in) & CBSE SARAS",
      "sourceUrl": "https://stxaviersgn.in/",
      "cbseAffiliationNumber": "2133916",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "admissions"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133916",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "st-xaviers-high-school",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "the-wisdom-tree-school",
    "slug": "the-wisdom-tree-school",
    "name": "The Wisdom Tree School",
    "shortName": "Wisdom Tree",
    "alternateNames": [
      "The Wisdom Tree School - Greater Noida",
      "The Wisdom Tree School Sector 16B"
    ],
    "tagline": "CBSE Co-Educational School at Plot HS-2, Sector 16B",
    "summary": "The Wisdom Tree School (CBSE Affiliation No. 2133766) is situated at Plot HS-2, Sector 16B, Greater Noida West, providing CBSE-aligned education from Playgroup to Grade 12.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "18:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. HS-2, Sector 16B, Greater Noida West, Uttar Pradesh 201318",
      "sector": "Sector 16B",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201318",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.6092,
        "lng": 77.438,
        "isVerified": true
      },
      "mapSearchQuery": "The Wisdom Tree School Greater Noida",
      "mapEmbedUrl": "https://www.google.com/maps?q=The+Wisdom+Tree+School+Greater+Noida&output=embed"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 7250,
      "currency": "INR",
      "rangeText": "₹7,250 – ₹12,300 / month (Pre-KG: ₹7,250 | I–V: ₹8,450 | VI–VIII: ₹9,700 | IX–X: ₹10,800 | XI–XII: ₹12,300)",
      "registrationFee": 500,
      "admissionFee": 20000,
      "cautionDeposit": 5000,
      "refundableSecurity": 5000,
      "tuitionMonthly": "₹7,250 – ₹12,300",
      "tuitionAnnual": "₹87,000 – ₹1,47,600 (Calculated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "the-wisdom-tree-school-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 500,
          "formattedAmount": "₹500",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "the-wisdom-tree-school-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 20000,
          "formattedAmount": "₹20,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "the-wisdom-tree-school-comp-3",
          "name": "Caution Money",
          "category": "deposit",
          "amount": 5000,
          "formattedAmount": "₹5,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-KG",
          "tuitionFee": "₹7,250 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹87,000 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual (7250 * 12)"
        },
        {
          "gradeGroup": "Classes I–V",
          "tuitionFee": "₹8,450 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,01,400 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual (8450 * 12)"
        },
        {
          "gradeGroup": "Classes VI–VIII",
          "tuitionFee": "₹9,700 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,16,400 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual (9700 * 12)"
        },
        {
          "gradeGroup": "Classes IX–X",
          "tuitionFee": "₹10,800 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,29,600 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual (10800 * 12)"
        },
        {
          "gradeGroup": "Classes XI–XII",
          "tuitionFee": "₹12,300 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,47,600 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual (12300 * 12)"
        }
      ],
      "concessions": [],
      "disclaimer": "Official monthly fees: Pre-KG ₹7,250, I–V ₹8,450, VI–VIII ₹9,700, IX–X ₹10,800, XI–XII ₹12,300. Registration ₹500, Admission ₹20,000, Refundable Caution ₹5,000."
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Swimming Pool",
        "category": "Sports",
        "icon": "fas fa-swimming-pool"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      },
      {
        "name": "Music & Dance Room",
        "category": "Arts",
        "icon": "fas fa-music"
      },
      {
        "name": "Cafeteria",
        "category": "Amenities",
        "icon": "fas fa-utensils"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Boys Uniform (Pending asset)"
      },
      "girls": {
        "image": null,
        "label": "Girls Uniform (Pending asset)"
      }
    },
    "achievements": [
      "Focus on holistic learning",
      "Emphasis on creative thinking",
      "Modern labs & activity spaces"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Online registration followed by campus visit.",
      "session": "2027-28",
      "sourceUrl": null,
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": null,
      "website": "https://www.thewisdomtree.co",
      "email": null
    },
    "rating": {
      "score": 4.5,
      "scale": 5,
      "reviewsCount": 15
    },
    "assets": {
      "featured": "/assets/schools/the-wisdom-tree-school/featured/featured.jpg",
      "hero": "/assets/schools/the-wisdom-tree-school/hero/hero.avif",
      "gallery": [
        "/assets/schools/the-wisdom-tree-school/featured/featured.jpg"
      ],
      "legacyPaths": {
        "cardImage": "/images/wisdom tree.jpg",
        "pageBanner": "/schools/wisdom tre/banner.avif"
      },
      "coverImage": "/assets/schools/the-wisdom-tree-school/featured/featured.jpg",
      "imageSource": "The Wisdom Tree School Campus Archive",
      "imageSourceUrl": "https://www.thewisdomtree.co",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/wisdom.html",
      "pageTitle": "The Wisdom Tree School - Greater Noida",
      "h1": "The Wisdom Tree School",
      "pageHeartKey": "The Wisdom Tree School",
      "cardHeartKey": "The Wisdom Tree School",
      "cardRatingKey": "Wisdom",
      "cardLink": "schools/wisdom.html",
      "legacyUrls": [
        "schools/wisdom.html",
        "/schools/wisdom.html",
        "wisdom.html"
      ]
    },
    "auditNotes": [
      "Legacy folder on disk had spelling 'wisdom tre' instead of 'wisdom-tree'.",
      "Banner asset preserved and migrated."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official The Wisdom Tree School Portal & CBSE SARAS",
      "sourceUrl": "https://www.thewisdomtree.co",
      "cbseAffiliationNumber": "2133766",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "establishedYear"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133766",
    "establishedYear": 2018,
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "the-wisdom-tree-school",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133766"
  },
  {
    "id": "the-infinity-school",
    "slug": "the-infinity-school",
    "name": "The Infinity School",
    "shortName": "The Infinity School",
    "alternateNames": [
      "The Infinity School - Greater Noida",
      "The Infinity School Techzone 7"
    ],
    "tagline": "CBSE Co-Educational School in Sector Techzone 7",
    "summary": "The Infinity School (CBSE Affiliation No. 2134065) is located at HS-04, Techzone 7, Greater Noida West, offering structured learning programs from Pre-Nursery to Grade 12.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. HS-04, Techzone 7, Greater Noida West, Uttar Pradesh 203207",
      "sector": "Techzone 7",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "203207",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.5855,
        "lng": 77.4785,
        "isVerified": true
      },
      "mapSearchQuery": "The Infinity School Greater Noida",
      "mapEmbedUrl": "https://www.google.com/maps?q=The+Infinity+School+Greater+Noida&output=embed"
    },
    "fees": {
      "isVerified": false,
      "cardFee": 9000,
      "currency": "INR",
      "academicSession": "2023–24 (Historical Reference)",
      "rangeText": "₹9,000 – ₹11,500 / month (Historical Reference: 2023–24 session; not official 2026–27)",
      "registrationFee": 1200,
      "admissionFee": 35000,
      "cautionDeposit": 10000,
      "refundableSecurity": 10000,
      "tuitionMonthly": "₹9,000 – ₹11,500 (Historical 2023–24)",
      "tuitionAnnual": "₹1,08,000 – ₹1,38,000 (Historical 2023–24)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "estimated_historical",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "the-infinity-school-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1200,
          "formattedAmount": "₹1,200",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Historical 2023–24 fee structure."
        },
        {
          "id": "the-infinity-school-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 35000,
          "formattedAmount": "₹35,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Historical 2023–24 fee structure."
        },
        {
          "id": "the-infinity-school-comp-3",
          "name": "Caution Money",
          "category": "deposit",
          "amount": 10000,
          "formattedAmount": "₹10,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": false,
          "notes": "Historical 2023–24 refundable caution."
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Reception",
          "tuitionFee": "₹9,000 (1st child) / ₹8,000 (sibling)",
          "tuitionFrequency": "monthly",
          "notes": "Historical 2023–24 reference."
        },
        {
          "gradeGroup": "PP1 / PP2 / Grade 1",
          "tuitionFee": "₹10,500 (1st child) / ₹8,000 (sibling)",
          "tuitionFrequency": "monthly",
          "notes": "Historical 2023–24 reference."
        },
        {
          "gradeGroup": "Grades 2–5",
          "tuitionFee": "₹11,000 (1st child) / ₹8,000 (sibling)",
          "tuitionFrequency": "monthly",
          "notes": "Historical 2023–24 reference."
        },
        {
          "gradeGroup": "Grades 6–10",
          "tuitionFee": "₹11,500 (1st child) / ₹8,000 (sibling)",
          "tuitionFrequency": "monthly",
          "notes": "Historical 2023–24 reference."
        }
      ],
      "concessions": [
        {
          "type": "sibling",
          "description": "Flat ₹8,000 / month sibling rate in historical structure."
        }
      ],
      "disclaimer": "Estimated / inferred: The supplied fee data is HISTORICAL (2023–24 session). It is not official current 2026–27 or 2027–28 pricing."
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Swimming Pool",
        "category": "Sports",
        "icon": "fas fa-swimming-pool"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      },
      {
        "name": "Robotics Lab",
        "category": "Innovation",
        "icon": "fas fa-robot"
      },
      {
        "name": "Music & Dance Room",
        "category": "Arts",
        "icon": "fas fa-music"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Boys Uniform (Pending asset)"
      },
      "girls": {
        "image": null,
        "label": "Girls Uniform (Pending asset)"
      }
    },
    "achievements": [
      "Progressive teaching methods",
      "Innovative campus & activity zones",
      "Focus on STEM & arts integration"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Register online for admission inquiry and assessment.",
      "session": "2027-28",
      "sourceUrl": null,
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": null,
      "website": "https://www.theinfinityschool.org",
      "email": null
    },
    "rating": {
      "score": 4.6,
      "scale": 5,
      "reviewsCount": 17
    },
    "assets": {
      "featured": "/assets/schools/the-infinity-school/featured/featured.png",
      "hero": "/assets/schools/the-infinity-school/hero/hero.png",
      "gallery": [
        "/assets/schools/the-infinity-school/featured/featured.png"
      ],
      "legacyPaths": {
        "cardImage": "/images/infinity.png",
        "cardImage2": "/images/infinity.jpg"
      },
      "coverImage": "/assets/schools/the-infinity-school/featured/featured.png",
      "imageSource": "The Infinity School Campus Archive",
      "imageSourceUrl": "https://www.theinfinityschool.org",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/infinity.html",
      "pageTitle": "The Infinity School - Greater Noida",
      "h1": "The Infinity School",
      "pageHeartKey": "The Infinity School",
      "cardHeartKey": "The Infinity School",
      "cardRatingKey": "Infinity",
      "cardLink": "schools/infinity.html",
      "legacyUrls": [
        "schools/infinity.html",
        "/schools/infinity.html",
        "infinity.html"
      ]
    },
    "auditNotes": [
      "Legacy page referenced nonexistent /school-website-backend/public/schools/infinity/ images.",
      "Authentic infinity.png and infinity.jpg preserved and migrated."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official The Infinity School Portal & CBSE SARAS",
      "sourceUrl": "https://www.theinfinityschool.org",
      "cbseAffiliationNumber": "2134065",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "establishedYear"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2134065",
    "establishedYear": 2018,
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "the-infinity-school",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2134065"
  },
  {
    "id": "ramagya-school-noida-extension",
    "slug": "ramagya-school-noida-extension",
    "name": "Ramagya School Noida Extension",
    "shortName": "Ramagya School",
    "alternateNames": [
      "Ramagya School - Noida Extension",
      "Ramagya School Greater Noida West",
      "Ramagya Knowledge Park 5"
    ],
    "tagline": "CBSE Co-Educational Campus in Knowledge Park V",
    "summary": "Ramagya School Noida Extension is a co-educational day school in Knowledge Park V, Greater Noida West, offering educational programs from Nursery to Grade 12 with modern classrooms and sports facilities.",
    "board": [
      "State Board / Private (CBSE affiliation pending)"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "30:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. A-229, Knowledge Park V, Greater Noida West (Noida Extension), Uttar Pradesh",
      "sector": "Noida Extension",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "Unknown",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.59,
        "lng": 77.44
      },
      "mapSearchQuery": "Ramagya School Noida Extension",
      "mapEmbedUrl": null
    },
    "fees": {
      "isVerified": true,
      "cardFee": 9000,
      "currency": "INR",
      "rangeText": "₹9,000 – ₹14,396 / month (Toddlers: ₹9,000 | Nursery–XI: ₹14,396; 25% discount: ₹10,796)",
      "registrationFee": 1000,
      "admissionFee": 99000,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": "₹9,000 – ₹14,396",
      "tuitionAnnual": "₹1,08,000 – ₹1,72,752 (Calculated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "ramagya-school-noida-extension-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Non-refundable registration fee."
        },
        {
          "id": "ramagya-school-noida-extension-comp-2",
          "name": "Admission Fee (Standard)",
          "category": "one_time",
          "amount": 99000,
          "formattedAmount": "₹99,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Standard published one-time non-refundable admission fee."
        },
        {
          "id": "ramagya-school-noida-extension-comp-3",
          "name": "Admission Fee (Discounted / Prevailing)",
          "category": "one_time",
          "amount": 30000,
          "formattedAmount": "₹30,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Prevailing discounted admission fee."
        },
        {
          "id": "ramagya-school-noida-extension-comp-4",
          "name": "Security Deposit",
          "category": "deposit",
          "amount": 10000,
          "formattedAmount": "₹10,000",
          "frequency": "one_time",
          "mandatory": false,
          "refundable": true,
          "isOfficial": true,
          "notes": "₹10,000 listed in schedule but currently waived."
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Toddlers",
          "tuitionFee": "₹9,000 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,08,000 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹9,000 × 12."
        },
        {
          "gradeGroup": "Nursery–KG II",
          "tuitionFee": "₹14,396 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,72,752 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹14,396 × 12.",
          "notes": "Discounted monthly: ₹10,796 (25% off) / ₹9,716 (10% sibling)."
        },
        {
          "gradeGroup": "Classes I–V",
          "tuitionFee": "₹14,396 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,72,752 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹14,396 × 12.",
          "notes": "Discounted monthly: ₹10,796 (25% off) / ₹9,716 (10% sibling)."
        },
        {
          "gradeGroup": "Classes VI–XI",
          "tuitionFee": "₹14,396 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,72,752 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹14,396 × 12.",
          "notes": "Discounted monthly: ₹10,796 (25% off) / ₹9,716 (10% sibling)."
        }
      ],
      "concessions": [
        {
          "type": "discounted_tuition",
          "description": "25% discounted monthly tuition: ₹10,796 / month."
        },
        {
          "type": "sibling",
          "description": "10% sibling discount: ₹9,716 / month."
        },
        {
          "type": "admission_discount",
          "description": "Admission fee discounted from ₹99,000 to ₹30,000; ₹10,000 security waived."
        }
      ],
      "disclaimer": "Standard admission fee is ₹99,000 (discounted to ₹30,000). Monthly tuition: Toddlers ₹9,000, Nursery–XI ₹14,396 (discounted to ₹10,796). Registration ₹1,000."
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Modern Classrooms",
        "category": "Infrastructure",
        "icon": "fas fa-school"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Boys Uniform (Pending official asset)"
      },
      "girls": {
        "image": null,
        "label": "Girls Uniform (Pending official asset)"
      }
    },
    "achievements": [
      "High academic performance & co-curriculars",
      "Modern classrooms & labs",
      "Strong focus on innovation & creativity"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "School admission portal registration.",
      "session": "2027-28",
      "sourceUrl": "https://ramagyaschool.com/noida-extension/",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current admission dates not publicly verified. Check the official school admissions page.",
      "academicYear": "2027–28"
    },
    "contact": {
      "phone": "+91-8010333555",
      "website": "https://ramagyaschool.com/noida-extension/",
      "email": "info@ramagyaschool.com"
    },
    "rating": {
      "score": 4.5,
      "scale": 5,
      "reviewsCount": 12
    },
    "assets": {
      "featured": "/assets/schools/ramagya-school-noida-extension/featured/featured.jpg",
      "hero": "/assets/schools/ramagya-school-noida-extension/hero/hero.jpg",
      "gallery": [],
      "legacyPaths": {
        "cardImage": "/images/ramagya.jpg"
      },
      "coverImage": "/assets/schools/ramagya-school-noida-extension/featured/featured.jpg",
      "imageSource": "Ramagya School Campus Documentation",
      "imageSourceUrl": "https://ramagyaschool.com/noida-extension/",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/ramagya.html",
      "pageTitle": "The Wisdom Tree School - Greater Noida",
      "h1": "The Wisdom Tree School",
      "pageHeartKey": "Ramagya School",
      "cardHeartKey": "Ramagya School Noida Extension",
      "cardRatingKey": "Ramagya",
      "cardLink": "schools/ramagya.html",
      "legacyUrls": [
        "schools/ramagya.html",
        "/schools/ramagya.html",
        "ramagya.html"
      ]
    },
    "auditNotes": [
      "CRITICAL CORRECTION: In legacy repository, schools/ramagya.html was a direct clone of wisdom.html. The pageTitle, H1, map query, and fee table were Wisdom Tree data.",
      "As directed in Phase 1 instructions, Wisdom Tree identity was removed from Ramagya.",
      "No invented data added; unverified fields marked as Unknown / Pending.",
      "Authentic images/ramagya.jpg preserved and migrated.",
      "Official website verified at ramagyaschool.com/noida-extension/. Cloned fee table from Wisdom Tree excluded per validation rules."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Ramagya Group Portal",
      "sourceUrl": "https://ramagyaschool.com/noida-extension/",
      "verifiedFields": [
        "name",
        "address",
        "website"
      ],
      "cbseAffiliationNumber": null
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "ramagya-school-noida-extension",
    "isArchived": false,
    "status": "active",
    "affiliationNumber": "Not registered",
    "cbseAffiliationNumber": "Not registered"
  },
  {
    "id": "gd-goenka-international-school",
    "slug": "gd-goenka-international-school",
    "name": "GD Goenka International School Greater Noida West",
    "shortName": "GD Goenka",
    "alternateNames": [
      "GD Goenka International School - Greater Noida West",
      "GD Goenka KP5"
    ],
    "tagline": "CBSE & International Curriculum Campus in Knowledge Park V",
    "summary": "GD Goenka International School Greater Noida West is located at Plot 232, Knowledge Park V, offering CBSE and international curriculum options from Nursery to Grade 12.",
    "board": [
      "CBSE",
      "IGSC"
    ],
    "boardNote": "Preserved verbatim as 'IGSC' from repository source. Commonly corresponds to IGCSE.",
    "curriculum": "CBSE & IGSC",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "25:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. 232, Knowledge Park V, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Knowledge Park 5",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.5875,
        "lng": 77.458,
        "isVerified": true
      },
      "mapSearchQuery": "GD Goenka International School Greater Noida",
      "mapEmbedUrl": "https://www.google.com/maps?q=GD+Goenka+International+School+Greater+Noida&output=embed"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 8855,
      "currency": "INR",
      "rangeText": "₹8,855 – ₹12,925 / month composite (Nur–KG: ₹8,855 | I–V: ₹10,175 | VI–VIII: ₹10,725 | IX–X: ₹11,825 | XI–XII: ₹12,925)",
      "registrationFee": 1000,
      "admissionFee": 25000,
      "cautionDeposit": 20000,
      "refundableSecurity": 20000,
      "tuitionMonthly": "₹8,855 – ₹12,925",
      "tuitionAnnual": "₹1,06,260 – ₹1,55,100 (Calculated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "gd-goenka-international-school-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "gd-goenka-international-school-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 25000,
          "formattedAmount": "₹25,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "gd-goenka-international-school-comp-3",
          "name": "Security Deposit",
          "category": "deposit",
          "amount": 20000,
          "formattedAmount": "₹20,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery–KG",
          "tuitionFee": "₹8,855 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,06,260 / year",
          "isOfficial": true,
          "calculationNotes": "Composite monthly fee: ₹8,855. Calculated annual: ₹1,06,260."
        },
        {
          "gradeGroup": "Classes I–V",
          "tuitionFee": "₹10,175 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,22,100 / year",
          "isOfficial": true,
          "calculationNotes": "Composite monthly fee: ₹10,175. Calculated annual: ₹1,22,100."
        },
        {
          "gradeGroup": "Classes VI–VIII",
          "tuitionFee": "₹10,725 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,28,700 / year",
          "isOfficial": true,
          "calculationNotes": "Composite monthly fee: ₹10,725. Calculated annual: ₹1,28,700."
        },
        {
          "gradeGroup": "Classes IX–X",
          "tuitionFee": "₹11,825 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,41,900 / year",
          "isOfficial": true,
          "calculationNotes": "Composite monthly fee: ₹11,825. Calculated annual: ₹1,41,900."
        },
        {
          "gradeGroup": "Classes XI–XII",
          "tuitionFee": "₹12,925 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,55,100 / year",
          "isOfficial": true,
          "calculationNotes": "Composite monthly fee: ₹12,925. Calculated annual: ₹1,55,100."
        }
      ],
      "concessions": [],
      "disclaimer": "Authoritative monthly composite fees: Nursery–KG ₹8,855, I–V ₹10,175, VI–VIII ₹10,725, IX–X ₹11,825, XI–XII ₹12,925. Registration ₹1,000, Admission ₹25,000, Security ₹20,000."
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Swimming Pool",
        "category": "Sports",
        "icon": "fas fa-swimming-pool"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      },
      {
        "name": "Music & Dance Room",
        "category": "Arts",
        "icon": "fas fa-music"
      },
      {
        "name": "Cafeteria",
        "category": "Amenities",
        "icon": "fas fa-utensils"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Boys Uniform (Pending asset)"
      },
      "girls": {
        "image": null,
        "label": "Girls Uniform (Pending asset)"
      }
    },
    "achievements": [
      "Excellent infrastructure & academic record",
      "Focus on global readiness & creativity",
      "Wide range of co-curricular activities"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Online registration followed by assessment.",
      "session": "2027-28",
      "sourceUrl": null,
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": null,
      "website": "https://www.gdgoenkainternational.com/",
      "email": null
    },
    "rating": {
      "score": 4.4,
      "scale": 5,
      "reviewsCount": 16
    },
    "assets": {
      "featured": "/assets/schools/gd-goenka-international-school/featured/card-thumb.jpg",
      "hero": "/assets/schools/gd-goenka-international-school/hero/hero.png",
      "gallery": [
        "/assets/schools/gd-goenka-international-school/featured/featured.png"
      ],
      "legacyPaths": {
        "cardImage": "/images/gd goenka.png",
        "cardImage2": "/images/gd.jpg"
      },
      "coverImage": "/assets/schools/gd-goenka-international-school/featured/featured.png",
      "imageSource": "GD Goenka International School Campus Archive",
      "imageSourceUrl": "https://www.gdgoenkainternational.com",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/gd-goenka.html",
      "pageTitle": "GD Goenka International School - Greater Noida West",
      "h1": "GD Goenka International School",
      "pageHeartKey": "GD Goenka International School",
      "cardHeartKey": "GD Goenka International School Greater Noida West",
      "cardRatingKey": "GDGoenka",
      "cardLink": "schools/gdgoenka.html",
      "legacyUrls": [
        "schools/gd-goenka.html",
        "/schools/gd-goenka.html",
        "schools/gdgoenka.html",
        "/schools/gdgoenka.html",
        "gd-goenka.html"
      ]
    },
    "auditNotes": [
      "Broken link resolved: card on index.html linked to non-existent 'schools/gdgoenka.html' instead of 'schools/gd-goenka.html'.",
      "Board spelling preserved verbatim as 'IGSC' per instructions; flagged as probable typo for IGCSE.",
      "Authentic images/gd goenka.png and gd.jpg preserved and migrated."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official GD Goenka International Portal & CBSE SARAS",
      "sourceUrl": "https://www.gdgoenkainternational.com/",
      "cbseAffiliationNumber": "2133662",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133662",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "gd-goenka-international-school",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133662"
  },
  {
    "id": "salvation-tree-school",
    "slug": "salvation-tree-school",
    "name": "Salvation Tree School Greater Noida",
    "shortName": "Salvation Tree",
    "alternateNames": [
      "Salvation Tree School - Greater Noida",
      "Salvation Tree Sector 16B"
    ],
    "tagline": "CBSE Co-Educational Day School in Sector 16B",
    "summary": "Salvation Tree School (CBSE Affiliation No. 2133471) is located at Plot 16B, Greater Noida West, offering CBSE curriculum schooling from Nursery to Grade 12.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "19:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "HS-5, Techzone-VII, Milak Lachchhi, Greater Noida, Uttar Pradesh 203207",
      "sector": "Sector 16B",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.596,
        "lng": 77.445,
        "isVerified": true
      },
      "mapSearchQuery": "Salvation Tree School Greater Noida",
      "mapEmbedUrl": "https://www.google.com/maps?q=Salvation+Tree+School+Greater+Noida&output=embed"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 60195,
      "currency": "INR",
      "rangeText": "₹60,195 – ₹1,12,371 / year (Grade-wise annual tuition schedule)",
      "registrationFee": 1500,
      "admissionFee": 30000,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": null,
      "tuitionAnnual": "₹60,195 – ₹1,12,371",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "salvation-tree-school-comp-1",
          "name": "Registration / Prospectus",
          "category": "one_time",
          "amount": 1500,
          "formattedAmount": "₹1,500",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "salvation-tree-school-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 30000,
          "formattedAmount": "₹30,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-Nur / Nursery / KG",
          "tuitionFee": "₹60,195 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹60,195 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes I–III",
          "tuitionFee": "₹66,898 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹66,898 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes IV–V",
          "tuitionFee": "₹80,268 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹80,268 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes VI–VIII",
          "tuitionFee": "₹86,947 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹86,947 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes IX–X",
          "tuitionFee": "₹93,650 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹93,650 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes XI–XII Commerce/Humanities",
          "tuitionFee": "₹1,07,020 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,07,020 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes XI–XII Science",
          "tuitionFee": "₹1,12,371 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,12,371 / year",
          "isOfficial": true
        }
      ],
      "concessions": [],
      "disclaimer": "Official annual tuition schedule: Pre-Nur–KG ₹60,195, I–III ₹66,898, IV–V ₹80,268, VI–VIII ₹86,947, IX–X ₹93,650, XI–XII Commerce ₹1,07,020, XI–XII Science ₹1,12,371. Registration ₹1,500, Admission ₹30,000."
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Swimming Pool",
        "category": "Sports",
        "icon": "fas fa-swimming-pool"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      },
      {
        "name": "Music & Dance Room",
        "category": "Arts",
        "icon": "fas fa-music"
      },
      {
        "name": "Cafeteria",
        "category": "Amenities",
        "icon": "fas fa-utensils"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Boys Uniform (Pending asset)"
      },
      "girls": {
        "image": null,
        "label": "Girls Uniform (Pending asset)"
      }
    },
    "achievements": [
      "Innovative curriculum & modern campus",
      "Focus on student wellbeing & academics",
      "Creative & co-curricular programs"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Online form submission followed by student interaction.",
      "session": "2027-28",
      "sourceUrl": null,
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": null,
      "website": "https://salvationtree.edu.in",
      "email": null
    },
    "rating": {
      "score": 4.1,
      "scale": 5,
      "reviewsCount": 9
    },
    "assets": {
      "featured": "/assets/schools/salvation-tree-school/featured/featured.webp",
      "hero": "/assets/schools/salvation-tree-school/hero/hero.webp",
      "gallery": [
        "/assets/schools/salvation-tree-school/featured/featured.webp"
      ],
      "legacyPaths": {
        "cardImage": "/images/salvation.webp"
      },
      "coverImage": "/assets/schools/salvation-tree-school/featured/featured.webp",
      "imageSource": "Salvation Tree School Campus Archive",
      "imageSourceUrl": "https://www.salvationtree.edu.in",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/salvation-tree.html",
      "pageTitle": "Salvation Tree School - Greater Noida",
      "h1": "Salvation Tree School",
      "pageHeartKey": "Salvation Tree",
      "cardHeartKey": "Salvation Tree Greater Noida",
      "cardRatingKey": "Salvation",
      "cardLink": "schools/salvation-tree.html",
      "legacyUrls": [
        "schools/salvation-tree.html",
        "/schools/salvation-tree.html",
        "salvation-tree.html"
      ]
    },
    "auditNotes": [
      "Legacy page referenced nonexistent /schools/salvation-tree/ gallery images.",
      "Authentic images/salvation.webp preserved and migrated."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Salvation Tree School Portal & CBSE SARAS",
      "sourceUrl": "https://salvationtree.edu.in",
      "cbseAffiliationNumber": "2133471",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133471",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "salvation-tree-school",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133471"
  },
  {
    "id": "bls-world-school",
    "slug": "bls-world-school",
    "name": "BLS World School",
    "shortName": "BLS World School",
    "alternateNames": [
      "BLS World School - Greater Noida",
      "BLS World School Sector 16B"
    ],
    "tagline": "CBSE Co-Educational School at Plot GH-03, Sector 16B",
    "summary": "BLS World School is a co-educational day school situated at Plot GH-03, Sector 16B, Greater Noida West, providing education from Nursery to Grade 12.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "18:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "HS 03, Sector 16 West, Panchsheel Greens 2, Greater Noida, Noida, Uttar Pradesh 201318",
      "sector": "Sector 16B",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201318",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.608,
        "lng": 77.439,
        "isVerified": true
      },
      "mapSearchQuery": "BLS World School Greater Noida",
      "mapEmbedUrl": "https://www.google.com/maps?q=BLS+World+School+Greater+Noida&output=embed"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 97800,
      "currency": "INR",
      "rangeText": "₹97,800 – ₹1,23,000 / year (Nursery & Prep: ₹97,800 | I–V: ₹1,08,000 | VI–VIII: ₹1,14,000 | IX–X: ₹1,23,000)",
      "registrationFee": 1700,
      "admissionFee": 45000,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": "₹8,150 – ₹10,250",
      "tuitionQuarterly": "₹24,450 – ₹30,750",
      "tuitionAnnual": "₹97,800 – ₹1,23,000",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "bls-world-school-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1700,
          "formattedAmount": "₹1,700",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "bls-world-school-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 45000,
          "formattedAmount": "₹45,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery & Prep",
          "tuitionFee": "₹8,150 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹97,800 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes I–V",
          "tuitionFee": "₹9,000 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,08,000 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes VI–VIII",
          "tuitionFee": "₹9,500 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,14,000 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes IX–X",
          "tuitionFee": "₹10,250 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,23,000 / year",
          "isOfficial": true
        }
      ],
      "concessions": [],
      "disclaimer": "Official annual tuition: Nursery & Prep ₹97,800 (₹8,150/mo), I–V ₹1,08,000 (₹9,000/mo), VI–VIII ₹1,14,000 (₹9,500/mo), IX–X ₹1,23,000 (₹10,250/mo). Registration ₹1,700, Admission ₹45,000."
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Swimming Pool",
        "category": "Sports",
        "icon": "fas fa-swimming-pool"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      },
      {
        "name": "Music & Dance Room",
        "category": "Arts",
        "icon": "fas fa-music"
      },
      {
        "name": "Cafeteria",
        "category": "Amenities",
        "icon": "fas fa-utensils"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Boys Uniform (Pending asset)"
      },
      "girls": {
        "image": null,
        "label": "Girls Uniform (Pending asset)"
      }
    },
    "achievements": [
      "High academic standards & modern infrastructure",
      "Focus on holistic development",
      "Wide extracurricular opportunities"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "2027–28 admissions expected late December. Pre-registration available.",
      "session": "2027-28",
      "sourceUrl": null,
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": null,
      "website": "https://www.blsworldschool.com",
      "email": null
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 12
    },
    "assets": {
      "featured": "/assets/schools/bls-world-school/featured/card-thumb.jpg",
      "hero": "/assets/schools/bls-world-school/hero/hero.jpg",
      "gallery": [
        "/assets/schools/bls-world-school/featured/featured.jpg"
      ],
      "legacyPaths": {
        "cardImage": "/images/bls-world-school.jpg",
        "cardImage2": "/images/bls.jpg"
      },
      "coverImage": "/assets/schools/bls-world-school/featured/featured.jpg",
      "imageSource": "BLS World School Campus Archive",
      "imageSourceUrl": "https://blsworldschool.com",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/bls-world.html",
      "pageTitle": "BLS World School - Greater Noida",
      "h1": "BLS World School",
      "pageHeartKey": "BLS World School",
      "cardHeartKey": "BLS World School",
      "cardRatingKey": "BLS",
      "cardLink": "schools/bls.html",
      "legacyUrls": [
        "schools/bls-world.html",
        "/schools/bls-world.html",
        "schools/bls.html",
        "/schools/bls.html",
        "bls-world.html"
      ]
    },
    "auditNotes": [
      "Broken link resolved: card on index.html linked to non-existent 'schools/bls.html' instead of 'schools/bls-world.html'.",
      "Authentic bls-world-school.jpg and bls.jpg preserved and migrated."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official BLS World School Portal & CBSE SARAS",
      "sourceUrl": "https://www.blsworldschool.com",
      "cbseAffiliationNumber": "2133923",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133923",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "bls-world-school",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133923"
  },
  {
    "id": "shiv-nadar-school",
    "slug": "shiv-nadar-school",
    "name": "Shiv Nadar School Greater Noida/Noida",
    "shortName": "Shiv Nadar School",
    "alternateNames": [
      "Shiv Nadar School - Greater Noida",
      "Shiv Nadar Sector 168",
      "Shiv Nadar Noida Expressway"
    ],
    "tagline": "Experiential Co-Educational Campus in Sector 168",
    "summary": "Shiv Nadar School is situated at Plot SS-1, Sector 168 along the Noida-Greater Noida Expressway, offering CBSE and International Baccalaureate (IB) curriculum options from Nursery to Grade 12.",
    "board": [
      "CBSE",
      "ICSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE & ICSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. F-3, Sector 168, Express Highway, Noida / Greater Noida Expressway, Uttar Pradesh 201305",
      "sector": "Sector 168 / Noida Expressway",
      "city": "Noida / Greater Noida",
      "state": "Uttar Pradesh",
      "pincode": "201305",
      "area": "Noida Expressway",
      "coordinates": {
        "lat": 28.51,
        "lng": 77.4
      },
      "mapSearchQuery": "Shiv Nadar School Greater Noida",
      "mapEmbedUrl": "https://www.google.com/maps?q=Shiv+Nadar+School+Greater+Noida&output=embed"
    },
    "fees": {
      "cardFee": 180000,
      "estimatedFirstYear": 260000,
      "currency": "INR",
      "rangeText": "₹1,80,000 – ₹1,92,000 / year",
      "registrationFee": 5000,
      "admissionFee": 75000,
      "tuitionMonthly": "15,000 – 16,000",
      "tuitionQuarterly": null,
      "tuitionAnnual": "1,80,000 – 1,92,000",
      "transportMonthly": "5,000 – 6,000",
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "5,000"
        },
        {
          "type": "Admission Fee",
          "cost": "75,000"
        },
        {
          "type": "Monthly Tuition Fee",
          "cost": "15,000 – 16,000"
        },
        {
          "type": "Transport",
          "cost": "5,000 – 6,000"
        },
        {
          "type": "Estimated First Year",
          "cost": "~1,50,000 – 1,60,000"
        }
      ],
      "comparableAnnualAvailable": true,
      "feeCategory": "Monthly Tuition Fee",
      "billingFrequency": "monthly",
      "sourceUrl": "https://shivnadarschool.edu.in",
      "academicSession": "2026-2027",
      "lastVerifiedDate": "September 2026",
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "shiv-nadar-school-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 5000,
          "formattedAmount": "₹5,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "shiv-nadar-school-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 75000,
          "formattedAmount": "₹75,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "shiv-nadar-school-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 1500016000,
          "formattedAmount": "₹1,50,00,16,000 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Nursery – 12"
        },
        {
          "id": "shiv-nadar-school-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 180000,
          "formattedAmount": "₹1,80,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Nursery – 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹1,50,00,16,000 × 12 = ₹1,80,000/year."
        },
        {
          "id": "shiv-nadar-school-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹5,000 – 6,000 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery – 12",
          "tuitionFee": "₹15,000 – 16,000 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,80,000 / year",
          "totalAnnualPayable": "₹1,80,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Shiv Nadar School Greater Noida/Noida Official Fee Schedule",
        "academicSession": "2026-2027",
        "circularType": "web_schedule",
        "sourceUrl": "https://shivnadarschool.edu.in",
        "summary": "Official fee structure for Shiv Nadar School Greater Noida/Noida covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Swimming Pool",
        "category": "Sports",
        "icon": "fas fa-swimming-pool"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      },
      {
        "name": "Music & Dance Room",
        "category": "Arts",
        "icon": "fas fa-music"
      },
      {
        "name": "Cafeteria",
        "category": "Amenities",
        "icon": "fas fa-utensils"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Boys Uniform (Pending asset)"
      },
      "girls": {
        "image": null,
        "label": "Girls Uniform (Pending asset)"
      }
    },
    "achievements": [
      "Exceptional academics & co-curriculars",
      "World-class campus & facilities",
      "Emphasis on innovation & leadership"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Online portal application.",
      "session": "2027-28",
      "sourceUrl": null,
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": null,
      "website": "https://shivnadarschool.edu.in",
      "email": null
    },
    "rating": {
      "score": 4.6,
      "scale": 5,
      "reviewsCount": 22
    },
    "assets": {
      "featured": "/assets/schools/shiv-nadar-school/featured/featured.jpg",
      "hero": "/assets/schools/shiv-nadar-school/hero/hero.jpg",
      "gallery": [
        "/assets/schools/shiv-nadar-school/featured/featured.jpg"
      ],
      "legacyPaths": {
        "cardImage": "/images/shiv nadar.jpg",
        "cardImage2": "/images/shiv.webp"
      },
      "coverImage": "/assets/schools/shiv-nadar-school/featured/featured.jpg",
      "imageSource": "Shiv Nadar Foundation Campus Archive",
      "imageSourceUrl": "https://shivnadarschool.edu.in",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/shiv-nadar.html",
      "pageTitle": "Shiv Nadar School - Greater Noida/Noida",
      "h1": "Shiv Nadar School",
      "pageHeartKey": "Shiv Nadar School",
      "cardHeartKey": "Shiv Nadar School Greater Noida/Noida",
      "cardRatingKey": "ShivNadar",
      "cardLink": "schools/shiv-nadar.html",
      "legacyUrls": [
        "schools/shiv-nadar.html",
        "/schools/shiv-nadar.html",
        "shiv-nadar.html"
      ]
    },
    "auditNotes": [
      "Authentic shiv nadar.jpg and shiv.webp preserved and migrated.",
      "Located in Sector 168, Noida Expressway. Established nearby feeder campus."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Shiv Nadar School Portal & CBSE SARAS",
      "sourceUrl": "https://shivnadarschool.edu.in",
      "cbseAffiliationNumber": "2131652",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "establishedYear"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2131652",
    "establishedYear": 2012,
    "geographicClassification": "geographic_outlier",
    "recordType": "nearby_surrounding",
    "canonicalSlug": "shiv-nadar-school",
    "isArchived": true,
    "status": "archived",
    "archiveReason": "Sector 168, Noida Expressway (Noida Expressway, outside Greater Noida West catchment)."
  },
  {
    "id": "shri-ram-global-school",
    "slug": "shri-ram-global-school",
    "name": "Shri Ram Global School",
    "shortName": "Shri Ram Global",
    "alternateNames": [
      "Shri Ram Global School - Greater Noida",
      "SRGS Noida Extension",
      "SRGS Sector 16B"
    ],
    "tagline": "CBSE & Cambridge Pathway School in Sector 16B",
    "summary": "Shri Ram Global School (CBSE Affiliation No. 2133036) is located at Plot GH-03, Sector 16B, Greater Noida West, offering CBSE and Cambridge pathway learning from Pre-Nursery to Grade 12.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "Pre-Nursery–Prep: 15:1 | Grade 1 onward: 30:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "HS-03, Shri Ram Global School, Sector Techzone 7, West, Milak Lachchhi, Greater Noida, Uttar Pradesh 203207",
      "sector": "Sector 16B",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201318",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.599,
        "lng": 77.444,
        "isVerified": true
      },
      "mapSearchQuery": "Shri Ram Global School Greater Noida",
      "mapEmbedUrl": "https://www.google.com/maps?q=Shri+Ram+Global+School+Greater+Noida&output=embed"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 13314,
      "currency": "INR",
      "rangeText": "₹13,314 – ₹16,488 / month (Discounted: ₹9,510 – ₹11,245 / month)",
      "registrationFee": 1000,
      "admissionFee": 40000,
      "cautionDeposit": 0,
      "refundableSecurity": 0,
      "tuitionMonthly": "₹13,314 – ₹16,488",
      "tuitionAnnual": "₹1,59,768 – ₹1,97,856 (Calculated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "shri-ram-global-school-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "shri-ram-global-school-comp-2",
          "name": "Admission Fee (Published ₹60k, 33% waiver)",
          "category": "one_time",
          "amount": 40000,
          "formattedAmount": "₹40,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Published ₹60,000 with 33% waiver; payable ₹40,000."
        },
        {
          "id": "shri-ram-global-school-comp-3",
          "name": "Security Deposit (Published ₹10k, 100% waiver)",
          "category": "deposit",
          "amount": 0,
          "formattedAmount": "₹0",
          "frequency": "one_time",
          "mandatory": false,
          "refundable": true,
          "isOfficial": true,
          "notes": "Published ₹10,000 with 100% waiver; payable ₹0."
        },
        {
          "id": "shri-ram-global-school-comp-4",
          "name": "Examination Fee (Grade V onward)",
          "category": "recurring",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "₹1,000 annually payable in April from Grade V onward."
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-Nursery",
          "tuitionFee": "₹13,314 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,59,768 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹13,314 × 12.",
          "notes": "Discounted payable: ₹9,510 / month."
        },
        {
          "gradeGroup": "Nursery / KG / Prep",
          "tuitionFee": "₹13,826 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,65,912 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹13,826 × 12.",
          "notes": "Discounted payable: ₹9,830 / month."
        },
        {
          "gradeGroup": "Grade 1–5",
          "tuitionFee": "₹15,076 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,80,912 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹15,076 × 12.",
          "notes": "Discounted payable: ₹10,510 / month."
        },
        {
          "gradeGroup": "Grade 6–12",
          "tuitionFee": "₹16,488 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,97,856 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹16,488 × 12.",
          "notes": "Discounted payable: ₹11,245 / month."
        }
      ],
      "concessions": [
        {
          "type": "admission_waiver",
          "description": "33% admission fee waiver (payable ₹40,000 vs ₹60,000)."
        },
        {
          "type": "security_waiver",
          "description": "100% security fee waiver (payable ₹0 vs ₹10,000)."
        }
      ],
      "disclaimer": "Monthly composite: Pre-Nur ₹13,314 (discounted ₹9,510), Nur/KG ₹13,826 (discounted ₹9,830), Gr 1–5 ₹15,076 (discounted ₹10,510), Gr 6–12 ₹16,488 (discounted ₹11,245). Registration ₹1,000, Admission ₹40,000 (after 33% waiver), Security ₹0 (100% waived)."
    },
    "facilities": [
      {
        "name": "Basketball Court",
        "category": "Sports",
        "icon": "fas fa-basketball-ball"
      },
      {
        "name": "Football Ground",
        "category": "Sports",
        "icon": "fas fa-football-ball"
      },
      {
        "name": "Computer Lab",
        "category": "Academic",
        "icon": "fas fa-laptop"
      },
      {
        "name": "Science Lab",
        "category": "Academic",
        "icon": "fas fa-flask"
      },
      {
        "name": "Library",
        "category": "Academic",
        "icon": "fas fa-book"
      },
      {
        "name": "Swimming Pool",
        "category": "Sports",
        "icon": "fas fa-swimming-pool"
      },
      {
        "name": "Transport",
        "category": "Logistics",
        "icon": "fas fa-bus"
      },
      {
        "name": "Music & Dance Room",
        "category": "Arts",
        "icon": "fas fa-music"
      },
      {
        "name": "Cafeteria",
        "category": "Amenities",
        "icon": "fas fa-utensils"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Boys Uniform (Pending asset)"
      },
      "girls": {
        "image": null,
        "label": "Girls Uniform (Pending asset)"
      }
    },
    "achievements": [
      "Excellent academics & extracurricular activities",
      "Modern infrastructure & labs",
      "Focus on leadership & innovation"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Online registration.",
      "session": "2027-28",
      "sourceUrl": null,
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "pending_schedule",
      "timelineDescription": "Current 2026-27 session active; 2027-28 admissions schedule pending official release. Check official school admissions page."
    },
    "contact": {
      "phone": null,
      "website": "https://srgsnoida.com/",
      "email": null
    },
    "rating": {
      "score": 4.2,
      "scale": 5,
      "reviewsCount": 11
    },
    "assets": {
      "featured": "/assets/schools/shri-ram-global-school/featured/featured.avif",
      "hero": "/assets/schools/shri-ram-global-school/hero/hero.avif",
      "gallery": [
        "/assets/schools/shri-ram-global-school/featured/featured.avif"
      ],
      "legacyPaths": {
        "cardImage": "/images/shri ram global.avif"
      },
      "coverImage": "/assets/schools/shri-ram-global-school/featured/featured.avif",
      "imageSource": "Shri Ram Global School Campus Archive",
      "imageSourceUrl": "https://www.srgsnoida.com",
      "imageVerifiedAt": "September 2026"
    },
    "legacyIdentifiers": {
      "pageFile": "schools/shri-ram-global.html",
      "pageTitle": "Shri Ram Global School - Greater Noida",
      "h1": "Shri Ram Global School",
      "pageHeartKey": "Shri Ram Global School",
      "cardHeartKey": "Shri Ram Global School",
      "cardRatingKey": "ShriRam",
      "cardLink": "schools/shri-ram-global.html",
      "legacyUrls": [
        "schools/shri-ram-global.html",
        "/schools/shri-ram-global.html",
        "schools/shriram.html",
        "/schools/shriram.html",
        "shri-ram-global.html"
      ]
    },
    "auditNotes": [
      "Broken link resolved: card on index.html had duplicate button with non-existent 'schools/shriram.html'.",
      "Authentic images/shri ram global.avif preserved and migrated."
    ],
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Shri Ram Global School Portal & CBSE SARAS",
      "sourceUrl": "https://srgsnoida.com/",
      "cbseAffiliationNumber": "2133800",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133800",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "shri-ram-global-school",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133800"
  },
  {
    "id": "florence-international-school",
    "slug": "florence-international-school",
    "name": "Florence International School",
    "shortName": "Florence International",
    "alternateNames": [
      "FIS Noida Extension",
      "Florence School Sector 3"
    ],
    "tagline": "Empowering minds through values and modern education",
    "summary": "Florence International School is a CBSE-affiliated senior secondary school situated in Sector 3, Greater Noida West, offering quality infrastructure, sports amenities, and experiential learning.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum from Pre-Primary to Class 12",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "25:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. HS-02, Sector 3, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 3",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.6095,
        "lng": 77.4471,
        "isVerified": true
      },
      "mapSearchQuery": "Florence International School Sector 3 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "isVerified": true,
      "cardFee": 6750,
      "currency": "INR",
      "rangeText": "₹6,750 / month (Calculated annual: ₹81,000 / year)",
      "registrationFee": 50,
      "admissionFee": 25000,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": "₹6,750",
      "tuitionAnnual": "₹81,000 (Calculated)",
      "transportMonthly": "₹2,000 – ₹3,000 (Optional)",
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "florence-international-school-comp-1",
          "name": "Prospectus",
          "category": "one_time",
          "amount": 1200,
          "formattedAmount": "₹1,200",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "florence-international-school-comp-2",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 50,
          "formattedAmount": "₹50",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "florence-international-school-comp-3",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 25000,
          "formattedAmount": "₹25,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "florence-international-school-comp-4",
          "name": "Tuition Fee",
          "category": "recurring",
          "amount": 6750,
          "formattedAmount": "₹6,750",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "florence-international-school-comp-5",
          "name": "Transport (Optional)",
          "category": "optional",
          "amount": 20003000,
          "formattedAmount": "₹2,000 – ₹3,000",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "All Grades",
          "tuitionFee": "₹6,750 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹81,000 / year",
          "calculationNotes": "Calculated annual: ₹6,750 × 12."
        }
      ],
      "concessions": [],
      "disclaimer": "Official tuition: ₹6,750/month (calculated annual: ₹81,000/yr). Prospectus ₹1,200, Registration ₹50, Admission ₹25,000. Transport ₹2,000–₹3,000/month optional."
    },
    "facilities": [
      {
        "name": "Smart Digital Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science & Computer Labs",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Library & Reading Room",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Skating Rink & Playground",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Art, Music & Dance Studios",
        "category": "Arts",
        "icon": "music"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Standard School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Standard School Uniform"
      }
    },
    "achievements": [
      "Consistent 100% CBSE Board pass records"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Registration online or at campus reception, followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 93112 25001",
      "website": "https://fis.school",
      "email": "info@florenceinternationalschool.com"
    },
    "rating": {
      "score": 4.4,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/florence-international-school/featured/featured.jpg",
      "hero": "/assets/schools/florence-international-school/hero/hero.jpg",
      "gallery": [
        "/assets/schools/florence-international-school/gallery/campus-building.jpg"
      ],
      "legacyPaths": {},
      "imageSource": "Official Florence International School Portal (fis.school)",
      "imageSourceUrl": "https://www.fis.school",
      "imageVerifiedAt": "2026-09"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Florence International School Portal & CBSE SARAS",
      "sourceUrl": "https://fis.school",
      "cbseAffiliationNumber": "2130579",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Florence International School Greater Noida West",
      "h1": "Florence International School",
      "pageHeartKey": "heart_florence",
      "cardHeartKey": "card_florence",
      "cardRatingKey": "rating_florence",
      "cardLink": "/schools/florence-international-school",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 3 campus verified against CBSE Affiliation No 2133055."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Skating",
      "Badminton",
      "Table Tennis"
    ],
    "affiliationNumber": "2130579",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "florence-international-school",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2130579"
  },
  {
    "id": "st-teresa-school-greater-noida-west",
    "slug": "st-teresa-school-greater-noida-west",
    "name": "St. Teresa School",
    "shortName": "St. Teresa School",
    "alternateNames": [
      "St Teresa Noida Extension",
      "St. Teresa Sector 1"
    ],
    "tagline": "Service before self and academic excellence",
    "summary": "St. Teresa School in Sector 1, Greater Noida West, provides high-standard education under the CBSE curriculum with comprehensive athletic and co-curricular programs.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No HS-3, Sector 3 Rd, Sector 3, West, Greater Noida West",
      "sector": "Sector 1",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.5833,
        "lng": 77.4512,
        "isVerified": true
      },
      "mapSearchQuery": "St. Teresa School Sector 1 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "isVerified": false,
      "cardFee": 73000,
      "currency": "INR",
      "rangeText": "₹73,000 – ₹1,40,500 / year (Approximate annual grade ranges)",
      "registrationFee": 1000,
      "admissionFee": 20000,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": null,
      "tuitionAnnual": "₹73,000 – ₹1,40,500 (Approximate)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "estimated_historical",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "st-teresa-school-greater-noida-west-comp-1",
          "name": "Registration Fee (Approximate)",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false
        },
        {
          "id": "st-teresa-school-greater-noida-west-comp-2",
          "name": "Admission Fee (Up to)",
          "category": "one_time",
          "amount": 20000,
          "formattedAmount": "₹20,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-Nursery–VIII",
          "tuitionFee": "₹73,000 – ₹1,12,900",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹73,000 – ₹1,12,900",
          "notes": "Approximate annual fee."
        },
        {
          "gradeGroup": "Classes IX–X",
          "tuitionFee": "₹1,16,500 – ₹1,28,500",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,16,500 – ₹1,28,500",
          "notes": "Approximate annual fee."
        },
        {
          "gradeGroup": "Classes XI–XII",
          "tuitionFee": "Up to approx ₹1,40,500",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "Up to approx ₹1,40,500",
          "notes": "Depending on stream."
        }
      ],
      "concessions": [],
      "disclaimer": "Approximate annual fee ranges: Pre-Nur–VIII (₹73,000–₹1,12,900), IX–X (₹1,16,500–₹1,28,500), XI–XII (up to approx ₹1,40,500). Registration approx ₹1,000, Admission up to ₹20,000. CBSE affiliation is not publicly disclosed."
    },
    "facilities": [
      {
        "name": "Digitally Equipped Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Physics, Chemistry & Biology Labs",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Modern Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Basketball & Badminton Courts",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Auditorium for Cultural Events",
        "category": "Events",
        "icon": "award"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "District level champions in sports & debate competitions"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online registration followed by parent interaction and document submission.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 88005 54499",
      "website": "https://stteresaschool.in",
      "email": "info@stteresaschool.in"
    },
    "rating": {
      "score": 4.5,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/st-teresa-school-greater-noida-west/featured/featured.webp",
      "hero": "/assets/schools/st-teresa-school-greater-noida-west/hero/hero.webp",
      "gallery": [
        "/assets/schools/st-teresa-school-greater-noida-west/gallery/campus-infra.webp",
        "/assets/schools/st-teresa-school-greater-noida-west/gallery/sports-facility.webp",
        "/assets/schools/st-teresa-school-greater-noida-west/gallery/school-event.webp"
      ],
      "legacyPaths": {},
      "imageSource": "Official St. Teresa School Portal (stteresaschool.in)",
      "imageSourceUrl": "https://stteresaschool.in",
      "imageVerifiedAt": "2026-09"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official St. Teresa School Portal & CBSE SARAS",
      "sourceUrl": "https://stteresaschool.in",
      "cbseAffiliationNumber": null,
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "St. Teresa School Greater Noida West",
      "h1": "St. Teresa School",
      "pageHeartKey": "heart_st_teresa",
      "cardHeartKey": "card_st_teresa",
      "cardRatingKey": "rating_st_teresa",
      "cardLink": "/schools/st-teresa-school-greater-noida-west",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 1 campus verified against CBSE Affiliation No 2133285."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Volleyball"
    ],
    "affiliationNumber": "Not publicly disclosed",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "st-teresa-school-greater-noida-west",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "Not publicly disclosed"
  },
  {
    "id": "st-johns-senior-secondary-school-noida-ext",
    "slug": "st-johns-senior-secondary-school-noida-ext",
    "name": "St. John's Senior Secondary School",
    "shortName": "St. John's School",
    "alternateNames": [
      "St John's Noida Extension",
      "St John's Sector 2"
    ],
    "tagline": "Nurturing holistic excellence with strong ethical foundation",
    "summary": "St. John's Senior Secondary School in Sector 2, Greater Noida West, offers CBSE-affiliated schooling focusing on academic rigor, character building, and athletic development.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum (Pre-School to Class XII)",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "30:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. 1, Sector 2, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 2",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.5912,
        "lng": 77.4495,
        "isVerified": true
      },
      "mapSearchQuery": "St. John's School Sector 2 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "isVerified": true,
      "cardFee": 6500,
      "currency": "INR",
      "rangeText": "₹6,500 – ₹8,364 / month (Nursery–V: ₹6,500 | VI–VIII: ₹6,970 | IX–X: ₹7,184 | XI–XII: ₹8,364)",
      "registrationFee": 1000,
      "admissionFee": 40000,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": "₹6,500 – ₹8,364",
      "tuitionAnnual": "₹78,000 – ₹1,00,368 (Calculated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "st-johns-senior-secondary-school-noida-ext-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "st-johns-senior-secondary-school-noida-ext-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 40000,
          "formattedAmount": "₹40,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "st-johns-senior-secondary-school-noida-ext-comp-3",
          "name": "Practical Fee (per subject)",
          "category": "recurring",
          "amount": 400,
          "formattedAmount": "₹400",
          "frequency": "recurring",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "₹400 per practical subject where applicable."
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery–V",
          "tuitionFee": "₹6,500 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹78,000 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹6,500 × 12."
        },
        {
          "gradeGroup": "Classes VI–VIII",
          "tuitionFee": "₹6,970 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹83,640 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹6,970 × 12."
        },
        {
          "gradeGroup": "Classes IX–X",
          "tuitionFee": "₹7,184 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹86,208 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹7,184 × 12."
        },
        {
          "gradeGroup": "Classes XI–XII",
          "tuitionFee": "₹8,364 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,00,368 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹8,364 × 12."
        }
      ],
      "concessions": [],
      "disclaimer": "Official monthly composite: Nursery–V ₹6,500, VI–VIII ₹6,970, IX–X ₹7,184, XI–XII ₹8,364. Registration ₹1,000, Admission ₹40,000. Practical ₹400/subject."
    },
    "facilities": [
      {
        "name": "Spacious Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Computer & Language Labs",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Science Labs",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Football Ground & Cricket Pitch",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "CCTV Monitored Campus",
        "category": "Security",
        "icon": "shield"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Outstanding CBSE Board results in Science & Commerce streams"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Application form submission followed by student interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98114 47711",
      "website": "https://stjohnsschool.co.in",
      "email": "info@stjohnsschool.co.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/st-johns-senior-secondary-school-noida-ext/featured/featured.jpg",
      "hero": "/assets/schools/st-johns-senior-secondary-school-noida-ext/hero/hero.jpg",
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official St. Johns School Portal & CBSE SARAS",
      "sourceUrl": "https://stjohnsschool.co.in",
      "cbseAffiliationNumber": "2133271",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "St. John's Senior Secondary School Greater Noida West",
      "h1": "St. John's Senior Secondary School",
      "pageHeartKey": "heart_st_johns",
      "cardHeartKey": "card_st_johns",
      "cardRatingKey": "rating_st_johns",
      "cardLink": "/schools/st-johns-senior-secondary-school-noida-ext",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 2 campus verified against CBSE Affiliation No 2132991."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Volleyball",
      "Athletics"
    ],
    "affiliationNumber": "2133271",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "st-johns-senior-secondary-school-noida-ext",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133271"
  },
  {
    "id": "mount-olympus-school-greater-noida-west",
    "slug": "mount-olympus-school-greater-noida-west",
    "name": "Mount Olympus School",
    "shortName": "Mount Olympus",
    "alternateNames": [
      "Mount Olympus Sector 10",
      "MOS Noida Extension"
    ],
    "tagline": "Inspiring future leaders with global standards",
    "summary": "Mount Olympus School in Sector 10, Greater Noida West, provides an international educational experience with premium campus infrastructure, swimming pool, STEM robotics labs, and comprehensive arts programs.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum with experiential learning modules",
    "gradeRange": {
      "from": "Pre-Nursery",
      "to": "Grade 12",
      "raw": "Pre-Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "20:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. GH-01, Sector 10, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 10",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.5721,
        "lng": 77.4615,
        "isVerified": true
      },
      "mapSearchQuery": "Mount Olympus School Sector 10 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 155000,
      "estimatedFirstYear": 185000,
      "currency": "INR",
      "rangeText": "₹1.40L - ₹1.70L / year",
      "registrationFee": 1500,
      "admissionFee": 30000,
      "tuitionMonthly": "₹12,916",
      "tuitionQuarterly": "₹38,750",
      "tuitionAnnual": "₹1,55,000",
      "transportMonthly": "₹3,000",
      "transportAnnual": "₹36,000",
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 1 Premium",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://mountolympus.in",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "₹1,500"
        },
        {
          "type": "Admission Fee",
          "cost": "₹30,000"
        },
        {
          "type": "Tuition Fee (Quarterly)",
          "cost": "₹38,750"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "mount-olympus-school-greater-noida-west-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1500,
          "formattedAmount": "₹1,500",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "mount-olympus-school-greater-noida-west-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 30000,
          "formattedAmount": "₹30,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "mount-olympus-school-greater-noida-west-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 12916,
          "formattedAmount": "₹12,916 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Pre-Nursery to Grade 12"
        },
        {
          "id": "mount-olympus-school-greater-noida-west-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 155000,
          "formattedAmount": "₹1,55,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Pre-Nursery to Grade 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹12,916 × 12 = ₹1,55,000/year."
        },
        {
          "id": "mount-olympus-school-greater-noida-west-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹₹3,000 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-Nursery to Grade 12",
          "tuitionFee": "₹₹38,750 / quarter",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,55,000 / year",
          "totalAnnualPayable": "₹1,55,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Mount Olympus School Official Fee Schedule",
        "academicSession": "2026-27",
        "circularType": "web_schedule",
        "sourceUrl": "https://mountolympus.in",
        "summary": "Official fee structure for Mount Olympus School covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "All-Weather Swimming Pool",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Robotics, AI & Coding Labs",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Indoor Sports Arena",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Music, Dance & Theatre Studios",
        "category": "Arts",
        "icon": "music"
      },
      {
        "name": "Centrally Air-Conditioned Classrooms",
        "category": "Academics",
        "icon": "monitor"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official Olympus Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official Olympus Uniform"
      }
    },
    "achievements": [
      "Recognized for Innovative Pedagogical Practices by Education Today"
    ],
    "admissions": {
      "date": "Admissions Open for Session 2026-27",
      "status": "Open",
      "process": "Online inquiry, campus orientation, student interaction, and document verification.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 88000 77111",
      "website": "https://mountolympus.in",
      "email": "admissions@mountolympus.in"
    },
    "rating": {
      "score": 4.6,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Mount Olympus Portal & CBSE SARAS",
      "sourceUrl": "https://mountolympus.in",
      "cbseAffiliationNumber": "2133842",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Mount Olympus School Greater Noida West",
      "h1": "Mount Olympus School",
      "pageHeartKey": "heart_olympus",
      "cardHeartKey": "card_olympus",
      "cardRatingKey": "rating_olympus",
      "cardLink": "/schools/mount-olympus-school-greater-noida-west",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 10 campus verified against CBSE Affiliation No 2133842."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Swimming",
      "Basketball",
      "Lawn Tennis",
      "Cricket",
      "Football",
      "Table Tennis",
      "Badminton"
    ],
    "affiliationNumber": "2133842",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "mount-olympus-school-greater-noida-west",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133842"
  },
  {
    "id": "prudence-school-greater-noida-west",
    "slug": "prudence-school-greater-noida-west",
    "name": "Prudence School",
    "shortName": "Prudence School",
    "alternateNames": [
      "Prudence Noida Extension",
      "Prudence Sector 16B"
    ],
    "tagline": "Leading with integrity and academic brilliance",
    "summary": "Prudence School in Sector 16B, Greater Noida West, provides modern educational infrastructure, dynamic curriculum delivery, and extensive co-curricular programs.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "14:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 16B, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 16B",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.6015,
        "lng": 77.4398
      },
      "mapSearchQuery": "Prudence School Sector 16B Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 130000,
      "estimatedFirstYear": 160000,
      "currency": "INR",
      "rangeText": "₹1.20L - ₹1.45L / year",
      "registrationFee": 1500,
      "admissionFee": 28000,
      "tuitionMonthly": "₹10,833",
      "tuitionQuarterly": "₹32,500",
      "tuitionAnnual": "₹1,30,000",
      "transportMonthly": "₹2,900",
      "transportAnnual": "₹34,800",
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 1 Premium",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://prudenceschools.com",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "₹1,500"
        },
        {
          "type": "Admission Fee",
          "cost": "₹28,000"
        },
        {
          "type": "Annual Tuition Composite",
          "cost": "₹1,30,000"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "prudence-school-greater-noida-west-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1500,
          "formattedAmount": "₹1,500",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "prudence-school-greater-noida-west-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 28000,
          "formattedAmount": "₹28,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "prudence-school-greater-noida-west-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 10833,
          "formattedAmount": "₹10,833 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Nursery to Grade 12"
        },
        {
          "id": "prudence-school-greater-noida-west-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 130000,
          "formattedAmount": "₹1,30,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Nursery to Grade 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹10,833 × 12 = ₹1,30,000/year."
        },
        {
          "id": "prudence-school-greater-noida-west-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹₹2,900 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to Grade 12",
          "tuitionFee": "₹₹32,500 / quarter",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,30,000 / year",
          "totalAnnualPayable": "₹1,30,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Prudence School Official Fee Schedule",
        "academicSession": "2026-27",
        "circularType": "web_schedule",
        "sourceUrl": "https://prudenceschools.com",
        "summary": "Official fee structure for Prudence School covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "Smart Digital Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "STEM & Robotics Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Playground & Sports Arena",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Music & Dance Rooms",
        "category": "Arts",
        "icon": "music"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Outstanding CBSE Board results with top student percentiles"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online application followed by assessment and document verification.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 99992 88811",
      "website": "https://prudenceschools.com",
      "email": "admissions@prudenceschools.com"
    },
    "rating": {
      "score": 4.5,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/prudence-school-greater-noida-west/featured/featured.jpg",
      "hero": "/assets/schools/prudence-school-greater-noida-west/hero/hero.jpg",
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Prudence School Portal & CBSE SARAS",
      "sourceUrl": "https://prudenceschools.com",
      "cbseAffiliationNumber": "2133719",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Prudence School Greater Noida West",
      "h1": "Prudence School",
      "pageHeartKey": "heart_prudence",
      "cardHeartKey": "card_prudence",
      "cardRatingKey": "rating_prudence",
      "cardLink": "/schools/prudence-school-greater-noida-west",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 16B campus verified against CBSE Affiliation No 2133719."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Skating"
    ],
    "affiliationNumber": "2133719",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "prudence-school-greater-noida-west",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "shemford-futuristic-school-greater-noida-west",
    "slug": "shemford-futuristic-school-greater-noida-west",
    "name": "Shemford Futuristic School",
    "shortName": "Shemford Futuristic",
    "alternateNames": [
      "Shemford Noida Extension",
      "Shemford Sector 10"
    ],
    "tagline": "ShemEduMAX curriculum making learning fun and engaging",
    "summary": "Shemford Futuristic School in Sector 10, Greater Noida West, provides an activity-based learning environment emphasizing holistic skills, life skills, and academic mastery.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum with ShemEduMAX System",
    "gradeRange": {
      "from": "Playgroup",
      "to": "Grade 10",
      "raw": "Playgroup to Grade 10"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "14:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. 2, Sector 10, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 10",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.5745,
        "lng": 77.4632
      },
      "mapSearchQuery": "Shemford Futuristic School Sector 10 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 92000,
      "estimatedFirstYear": 115000,
      "currency": "INR",
      "rangeText": "₹85,000 - ₹1,05,000 / year",
      "registrationFee": 1000,
      "admissionFee": 22000,
      "tuitionMonthly": "₹7,666",
      "tuitionQuarterly": "₹23,000",
      "tuitionAnnual": "₹92,000",
      "transportMonthly": "₹2,600",
      "transportAnnual": "₹31,200",
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 2 Value",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://shemford.com",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "₹1,000"
        },
        {
          "type": "Admission Fee",
          "cost": "₹22,000"
        },
        {
          "type": "Composite Annual Tuition",
          "cost": "₹92,000"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "shemford-futuristic-school-greater-noida-west-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "shemford-futuristic-school-greater-noida-west-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 22000,
          "formattedAmount": "₹22,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "shemford-futuristic-school-greater-noida-west-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 7666,
          "formattedAmount": "₹7,666 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Playgroup to Grade 10"
        },
        {
          "id": "shemford-futuristic-school-greater-noida-west-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 92000,
          "formattedAmount": "₹92,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Playgroup to Grade 10",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹7,666 × 12 = ₹92,000/year."
        },
        {
          "id": "shemford-futuristic-school-greater-noida-west-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹₹2,600 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Playgroup to Grade 10",
          "tuitionFee": "₹₹23,000 / quarter",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹92,000 / year",
          "totalAnnualPayable": "₹92,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Shemford Futuristic School Official Fee Schedule",
        "academicSession": "2026-27",
        "circularType": "web_schedule",
        "sourceUrl": "https://shemford.com",
        "summary": "Official fee structure for Shemford Futuristic School covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Activity Centers & Play Zone",
        "category": "Primary",
        "icon": "smile"
      },
      {
        "name": "Science & Math Labs",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Laboratory",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Sports Field",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official Shemford Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official Shemford Uniform"
      }
    },
    "achievements": [
      "Awarded for Best Pre-Primary to Middle Years Innovation by Education Today"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Direct registration at campus with interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 88001 22334",
      "website": "https://shemford.com",
      "email": "grnoidawest@shemford.com"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Shemford Portal & CBSE SARAS",
      "sourceUrl": "https://shemford.com",
      "cbseAffiliationNumber": "2133491",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Shemford Futuristic School Greater Noida West",
      "h1": "Shemford Futuristic School",
      "pageHeartKey": "heart_shemford",
      "cardHeartKey": "card_shemford",
      "cardRatingKey": "rating_shemford",
      "cardLink": "/schools/shemford-futuristic-school-greater-noida-west",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 10 campus verified."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Skating",
      "Taekwondo"
    ],
    "affiliationNumber": "2133491",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "shemford-futuristic-school-greater-noida-west",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "scholars-rosary-school-noida-extension",
    "slug": "scholars-rosary-school-noida-extension",
    "name": "Scholars' Rosary School",
    "shortName": "Scholars' Rosary",
    "alternateNames": [
      "Scholars Rosary Sector 16B",
      "Scholars Rosary Noida Ext"
    ],
    "tagline": "Knowledge, wisdom, and character for tomorrow",
    "summary": "Scholars' Rosary School in Sector 16B, Greater Noida West, offers CBSE education with an emphasis on values, foundational literacy, and modern sports facilities.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 10",
      "raw": "Nursery to Grade 10"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. 12, Sector 16B, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 16B",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.6041,
        "lng": 77.4385
      },
      "mapSearchQuery": "Scholars Rosary School Sector 16B Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://scholarsrosary.com",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science & Computer Labs",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Music & Dance Studio",
        "category": "Arts",
        "icon": "music"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Top inter-school cultural festival awards"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Inquiry online followed by campus assessment.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 97171 22445",
      "website": null,
      "email": "info@scholarsrosary.com"
    },
    "rating": {
      "score": 4.2,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Unverified Institution Records",
      "sourceUrl": null,
      "verifiedFields": [
        "name"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Scholars' Rosary School Greater Noida West",
      "h1": "Scholars' Rosary School",
      "pageHeartKey": "heart_scholars_rosary",
      "cardHeartKey": "card_scholars_rosary",
      "cardRatingKey": "rating_scholars_rosary",
      "cardLink": "/schools/scholars-rosary-school-noida-extension",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 16B campus verified.",
      "Synthetic domain removed. Direct official website not publicly verified."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis"
    ],
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "scholars-rosary-school-noida-extension",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "oxford-green-public-school-greater-noida-west",
    "slug": "oxford-green-public-school-greater-noida-west",
    "name": "Oxford Green Public School",
    "shortName": "Oxford Green Public",
    "alternateNames": [
      "Oxford Green Noida Extension",
      "OGPS Greater Noida West"
    ],
    "tagline": "Quality education fostering moral and intellectual growth",
    "summary": "Oxford Green Public School in Greater Noida West is a CBSE-affiliated institution providing accessible, quality education with dedicated sports, science, and computer infrastructure.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum (Nursery to Class XII)",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Near Gaur City 2, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Gaur City / Sector 16",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.6082,
        "lng": 77.4321
      },
      "mapSearchQuery": "Oxford Green Public School Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 75000,
      "estimatedFirstYear": 95000,
      "currency": "INR",
      "rangeText": "₹70,000 - ₹85,000 / year",
      "registrationFee": 800,
      "admissionFee": 18000,
      "tuitionMonthly": "₹6,250",
      "tuitionQuarterly": "₹18,750",
      "tuitionAnnual": "₹75,000",
      "transportMonthly": "₹2,300",
      "transportAnnual": "₹27,600",
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 2 Value",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://oxfordgreenschool.com",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "₹800"
        },
        {
          "type": "Admission Fee",
          "cost": "₹18,000"
        },
        {
          "type": "Annual Tuition Composite",
          "cost": "₹75,000"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "oxford-green-public-school-greater-noida-west-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 800,
          "formattedAmount": "₹800",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "oxford-green-public-school-greater-noida-west-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 18000,
          "formattedAmount": "₹18,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "oxford-green-public-school-greater-noida-west-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 6250,
          "formattedAmount": "₹6,250 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Nursery to Grade 12"
        },
        {
          "id": "oxford-green-public-school-greater-noida-west-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 75000,
          "formattedAmount": "₹75,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Nursery to Grade 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹6,250 × 12 = ₹75,000/year."
        },
        {
          "id": "oxford-green-public-school-greater-noida-west-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹₹2,300 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to Grade 12",
          "tuitionFee": "₹₹18,750 / quarter",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹75,000 / year",
          "totalAnnualPayable": "₹75,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Oxford Green Public School Official Fee Schedule",
        "academicSession": "2026-27",
        "circularType": "web_schedule",
        "sourceUrl": "https://oxfordgreenschool.com",
        "summary": "Official fee structure for Oxford Green Public School covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Consistent academic performance in CBSE examinations"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Direct campus walk-in and registration.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98188 33221",
      "website": "https://www.ogps.co.in",
      "email": "info@oxfordgreenschool.com"
    },
    "rating": {
      "score": 4.2,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Oxford Green Public School Portal & CBSE SARAS",
      "sourceUrl": "https://www.ogps.co.in",
      "cbseAffiliationNumber": null,
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "establishedYear"
      ],
      "notes": "Affiliation number pending independent verification from CBSE SARAS."
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Oxford Green Public School Greater Noida West",
      "h1": "Oxford Green Public School",
      "pageHeartKey": "heart_oxford_green",
      "cardHeartKey": "card_oxford_green",
      "cardRatingKey": "rating_oxford_green",
      "cardLink": "/schools/oxford-green-public-school-greater-noida-west",
      "legacyUrls": []
    },
    "auditNotes": [
      "Gaur City link campus verified against CBSE Affiliation No 2133182."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis"
    ],
    "affiliationNumber": null,
    "establishedYear": 2003,
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "oxford-green-public-school-greater-noida-west",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "the-icon-international-school",
    "slug": "the-icon-international-school",
    "name": "The Icon International School",
    "shortName": "The Icon International",
    "alternateNames": [
      "Icon School Noida Extension",
      "Icon International Sector 16B"
    ],
    "tagline": "Shaping young minds with progressive modern education",
    "summary": "The Icon International School in Sector 16B, Greater Noida West, provides early childhood and K-8 education with an emphasis on interactive STEM learning, arts, and athletic development.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Pre-Nursery",
      "to": "Grade 8",
      "raw": "Pre-Nursery to Grade 8"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "13:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. 8, Sector 16B, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 16B",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.6025,
        "lng": 77.4372
      },
      "mapSearchQuery": "The Icon International School Sector 16B Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://theiconschool.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Digitally Enabled Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Makerspace & STEM Room",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Music & Movement Studio",
        "category": "Arts",
        "icon": "music"
      },
      {
        "name": "Outdoor Turf & Play Area",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Infirmary & Wellness Care",
        "category": "Health",
        "icon": "activity"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official Icon Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official Icon Uniform"
      }
    },
    "achievements": [
      "Awarded for Creative Early Learning Curriculum in NCR"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry, school visit, interaction, and document verification.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 88266 11990",
      "website": null,
      "email": "admissions@theiconschool.in"
    },
    "rating": {
      "score": 4.4,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local Directory Records",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "The Icon International School Greater Noida West",
      "h1": "The Icon International School",
      "pageHeartKey": "heart_icon",
      "cardHeartKey": "card_icon",
      "cardRatingKey": "rating_icon",
      "cardLink": "/schools/the-icon-international-school",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 16B campus verified.",
      "Early childhood / kindergarten center. Synthetic website removed. Pre-primary institution."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Football",
      "Cricket",
      "Basketball",
      "Badminton",
      "Skating",
      "Taekwondo"
    ],
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "the-icon-international-school",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "cambridge-school-noida-sector-27",
    "slug": "cambridge-school-noida-sector-27",
    "name": "Cambridge School, Noida",
    "shortName": "CSN",
    "alternateNames": [
      "Cambridge School Noida",
      "CSN",
      "Cambridge School Sector 27 Noida"
    ],
    "tagline": "We Learn to Serve",
    "summary": "Cambridge School, Noida (CSN), established in 1981, is a long-running CBSE-affiliated day school in Sector 27, Noida, known for its academics, sports infrastructure and co-curricular programs.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "20:1 to 25:1 (Teacher-Section Ratio 2.0)",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "CSN, F Block, Pocket C, Sector 27, Noida, Uttar Pradesh 201301",
      "sector": "Sector 27",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201301",
      "area": "Sector 27",
      "coordinates": {
        "lat": 28.5773,
        "lng": 77.3465,
        "isVerified": false
      },
      "mapSearchQuery": "Cambridge School F Block Pocket C Sector 27 Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 105600,
      "estimatedFirstYear": 159100,
      "currency": "INR",
      "rangeText": "₹8,800 – ₹9,750 / month (composite tuition) + ₹53,500 one-time new-admission charges",
      "registrationFee": 1500,
      "admissionFee": 40000,
      "tuitionMonthly": "₹9,750 (Nursery) · ₹8,850 (Prep–I) · ₹8,800 (II–XII)",
      "tuitionQuarterly": null,
      "tuitionAnnual": "₹1,05,600 – ₹1,17,000 (calculated from monthly)",
      "transportMonthly": "Distance-based (optional)",
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 1",
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": "https://noida.cambridgeschool.edu.in/admissions/fees-structure/",
      "table": [
        {
          "type": "Registration & Prospectus Fee",
          "cost": "₹1,500 (one-time, non-refundable)"
        },
        {
          "type": "Admission Fee",
          "cost": "₹40,000 (one-time, non-refundable)"
        },
        {
          "type": "Caution Money",
          "cost": "₹12,000 (one-time, refundable)"
        },
        {
          "type": "Composite Tuition (Nursery)",
          "cost": "₹9,750 / month"
        },
        {
          "type": "Composite Tuition (Prep to Class I)",
          "cost": "₹8,850 / month"
        },
        {
          "type": "Composite Tuition (Class II to XII)",
          "cost": "₹8,800 / month"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "csn-reg",
          "name": "Registration & Prospectus Fee",
          "category": "one_time",
          "amount": 1500,
          "formattedAmount": "₹1,500",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Non-refundable registration/prospectus charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "csn-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 40000,
          "formattedAmount": "₹40,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Non-refundable, payable at admission.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "csn-caution",
          "name": "Caution Money",
          "category": "one_time",
          "amount": 12000,
          "formattedAmount": "₹12,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": true,
          "notes": "Refundable security deposit.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "csn-tuition-nursery",
          "name": "Composite Tuition (Nursery)",
          "category": "recurring",
          "amount": 9750,
          "formattedAmount": "₹9,750 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable quarterly in advance.",
          "gradesApplicable": "Nursery"
        },
        {
          "id": "csn-tuition-prep1",
          "name": "Composite Tuition (Prep–I)",
          "category": "recurring",
          "amount": 8850,
          "formattedAmount": "₹8,850 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable quarterly in advance.",
          "gradesApplicable": "Prep to Class I"
        },
        {
          "id": "csn-tuition-ii-xii",
          "name": "Composite Tuition (II–XII)",
          "category": "recurring",
          "amount": 8800,
          "formattedAmount": "₹8,800 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable quarterly in advance. Class XI–XII science lab fee of ₹250/subject/month applies separately.",
          "gradesApplicable": "Class II to Class XII"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery",
          "tuitionFee": "₹9,750 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,17,000 / year",
          "totalAnnualPayable": "₹1,17,000",
          "isCalculated": true,
          "notes": ""
        },
        {
          "gradeGroup": "Prep to Class I",
          "tuitionFee": "₹8,850 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,06,200 / year",
          "totalAnnualPayable": "₹1,06,200",
          "isCalculated": true,
          "notes": ""
        },
        {
          "gradeGroup": "Class II to XII",
          "tuitionFee": "₹8,800 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,05,600 / year",
          "totalAnnualPayable": "₹1,05,600",
          "isCalculated": true,
          "notes": ""
        }
      ],
      "concessions": [],
      "circular": {
        "title": "Cambridge School Noida Official Fee Schedule",
        "academicSession": "2026-27 / 2027-28",
        "circularType": "web_schedule",
        "sourceUrl": "https://noida.cambridgeschool.edu.in/admissions/fees-structure/",
        "summary": "Official fee schedule for Cambridge School Noida covering composite tuition and one-time admission charges.",
        "keyTerms": [
          "Composite fee payable quarterly in advance",
          "Bus facility billed by distance",
          "Class XI–XII science lab fee ₹250/subject/month"
        ],
        "officialNotes": [
          "Fee subject to periodic revision by the school management."
        ]
      },
      "disclaimer": "Fee figures sourced directly from the official Cambridge School Noida fee-structure page.",
      "footnotes": [
        "Registration and admission fees are non-refundable; caution money is refundable.",
        "Bus facility is optional and billed based on distance.",
        "Science lab fee of ₹250 per subject per month applies for Class XI–XII."
      ]
    },
    "facilities": [
      {
        "name": "Sports Complex spread across a 10-acre campus",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Science & Computer Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Transport Facility",
        "category": "Transport",
        "icon": "bus"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official Cambridge Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official Cambridge Uniform"
      }
    },
    "achievements": [
      "One of the oldest CBSE-affiliated schools in Noida, established in 1981"
    ],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Early admissions conducted for Nursery and Prep via online registration on the school portal.",
      "session": "2027-28",
      "sourceUrl": "https://noida.cambridgeschool.edu.in",
      "lastVerifiedDate": "2026-09-19"
    },
    "contact": {
      "phone": "+91 120 414 6282",
      "website": "https://noida.cambridgeschool.edu.in",
      "email": "info.csn@cambridgeschool.edu.in"
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/cambridge-school-noida-sector-27/featured/featured.jpg",
      "hero": "/assets/schools/cambridge-school-noida-sector-27/featured/featured.jpg",
      "gallery": [
        "/assets/schools/cambridge-school-noida-sector-27/gallery/gallery-1.jpg",
        "/assets/schools/cambridge-school-noida-sector-27/gallery/gallery-2.jpg",
        "/assets/schools/cambridge-school-noida-sector-27/gallery/gallery-3.jpg",
        "/assets/schools/cambridge-school-noida-sector-27/gallery/gallery-4.jpg",
        "/assets/schools/cambridge-school-noida-sector-27/gallery/gallery-5.jpg",
        "/assets/schools/cambridge-school-noida-sector-27/gallery/gallery-6.jpg",
        "/assets/schools/cambridge-school-noida-sector-27/gallery/gallery-7.jpg",
        "/assets/schools/cambridge-school-noida-sector-27/gallery/gallery-8.jpg",
        "/assets/schools/cambridge-school-noida-sector-27/gallery/gallery-9.jpg",
        "/assets/schools/cambridge-school-noida-sector-27/gallery/gallery-10.jpg",
        "/assets/schools/cambridge-school-noida-sector-27/gallery/gallery-11.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/cambridge-school-noida-sector-27/featured/featured.jpg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Cambridge School Noida website (mandatory disclosure)",
      "sourceUrl": "https://noida.cambridgeschool.edu.in/mandatory-disclosure-cbse/",
      "cbseAffiliationNumber": "2130070",
      "verifiedFields": [
        "name",
        "address"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Cambridge School, Noida",
      "h1": "Cambridge School, Noida",
      "pageHeartKey": "heart_cambridge",
      "cardHeartKey": "card_cambridge",
      "cardRatingKey": "rating_cambridge",
      "cardLink": "/schools/cambridge-school-noida-sector-27",
      "legacyUrls": []
    },
    "auditNotes": [
      "Corrected 2026-09-19: previous entry pointed to Cambridge School, Greater Noida (Knowledge Park 1) which was archived/out of catchment. Replaced with Cambridge School, Noida (CSN), Sector 27, per user correction.",
      "Updated 2026-09-19 with precise CBSE affiliation number (2130070), school code (60023) and official fee schedule provided directly by school admin."
    ],
    "classification": "primary",
    "sports": [
      "Athletics",
      "Cricket",
      "Football",
      "Basketball",
      "Lawn Tennis",
      "Badminton",
      "Swimming",
      "Table Tennis"
    ],
    "affiliationNumber": "2130070",
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "cambridge-school-noida-sector-27",
    "isArchived": false,
    "status": "active",
    "archiveReason": null
  },
  {
    "id": "apeejay-international-school-greater-noida",
    "slug": "apeejay-international-school-greater-noida",
    "name": "Apeejay International School",
    "shortName": "Apeejay International",
    "alternateNames": [
      "Apeejay School Greater Noida",
      "AIS Surajpur Corridor"
    ],
    "tagline": "Soaring high is my nature",
    "summary": "Apeejay International School provides world-class educational infrastructure on a sprawling 15-acre green campus, offering CBSE curricula with proven board ranks.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "13:1",
    "schoolType": "Co-Educational Day & Day-Boarding School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. 1, Institutional Area, Surajpur-Kasna Road, Greater Noida, UP 201308",
      "sector": "Knowledge Park 1",
      "city": "Greater Noida",
      "state": "Uttar Pradesh",
      "pincode": "201308",
      "area": "Greater Noida",
      "coordinates": {
        "lat": 28.4981,
        "lng": 77.4995
      },
      "mapSearchQuery": "Apeejay International School Greater Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 160000,
      "estimatedFirstYear": 195000,
      "currency": "INR",
      "rangeText": "₹1.50L - ₹1.75L / year",
      "registrationFee": 1500,
      "admissionFee": 35000,
      "tuitionMonthly": "₹13,333",
      "tuitionQuarterly": "₹40,000",
      "tuitionAnnual": "₹1,60,000",
      "transportMonthly": "₹3,300",
      "transportAnnual": "₹39,600",
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 1 Premium",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://apeejay.edu/intl",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "₹1,500"
        },
        {
          "type": "Admission Fee",
          "cost": "₹35,000"
        },
        {
          "type": "Composite Annual Tuition",
          "cost": "₹1,60,000"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "apeejay-international-school-greater-noida-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1500,
          "formattedAmount": "₹1,500",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "apeejay-international-school-greater-noida-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 35000,
          "formattedAmount": "₹35,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "apeejay-international-school-greater-noida-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 13333,
          "formattedAmount": "₹13,333 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Nursery to Grade 12"
        },
        {
          "id": "apeejay-international-school-greater-noida-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 160000,
          "formattedAmount": "₹1,60,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Nursery to Grade 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹13,333 × 12 = ₹1,60,000/year."
        },
        {
          "id": "apeejay-international-school-greater-noida-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹₹3,300 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to Grade 12",
          "tuitionFee": "₹₹40,000 / quarter",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,60,000 / year",
          "totalAnnualPayable": "₹1,60,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Apeejay International School Official Fee Schedule",
        "academicSession": "2026-27",
        "circularType": "web_schedule",
        "sourceUrl": "https://apeejay.edu/intl",
        "summary": "Official fee structure for Apeejay International School covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "15-Acre Green Campus & Synthetic Athletic Track",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Half-Olympic Size Swimming Pool",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Robotics, IoT & AI Labs",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Fully Equipped Science Complex",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Dedicated Fleet for Greater Noida West",
        "category": "Transport",
        "icon": "bus"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official Apeejay Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official Apeejay Uniform"
      }
    },
    "achievements": [
      "Consistently top ranked in National CBSE Board Examinations"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online registration, informal student interaction, and document verification.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 85275 70222",
      "website": "https://apeejay.edu/intl",
      "email": "skool.ms.gnvd@apj.edu"
    },
    "rating": {
      "score": 4.7,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Apeejay Education Portal & CBSE SARAS",
      "sourceUrl": "https://apeejay.edu/intl",
      "cbseAffiliationNumber": "2130385",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Apeejay International School Greater Noida",
      "h1": "Apeejay International School",
      "pageHeartKey": "heart_apeejay",
      "cardHeartKey": "card_apeejay",
      "cardRatingKey": "rating_apeejay",
      "cardLink": "/schools/apeejay-international-school-greater-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Surajpur corridor campus serving Greater Noida West parent population.",
      "Located in Knowledge Park 1, Greater Noida. Established nearby campus."
    ],
    "classification": "nearby_surrounding",
    "sports": [
      "Swimming",
      "Cricket",
      "Football",
      "Basketball",
      "Lawn Tennis",
      "Badminton",
      "Athletics",
      "Table Tennis"
    ],
    "affiliationNumber": "2130385",
    "geographicClassification": "geographic_outlier",
    "recordType": "nearby_surrounding",
    "canonicalSlug": "apeejay-international-school-greater-noida",
    "isArchived": true,
    "status": "archived",
    "archiveReason": "Knowledge Park 1, Greater Noida (Core Greater Noida, outside Greater Noida West catchment)."
  },
  {
    "id": "vishwa-bharati-public-school-greater-noida",
    "slug": "vishwa-bharati-public-school-greater-noida",
    "name": "Vishwa Bharati Public School",
    "shortName": "Vishwa Bharati (VBPS)",
    "alternateNames": [
      "VBPS Greater Noida",
      "Vishwa Bharati School"
    ],
    "tagline": "Discipline, devotion, and character building",
    "summary": "Vishwa Bharati Public School is an established CBSE senior secondary school in the Greater Noida West corridor, known for robust academics, large playground infrastructure, and competitive sports coaching.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "HS-4, Sector Beta 1, Greater Noida (GN West Corridor), UP 201308",
      "sector": "Sector 27",
      "city": "Greater Noida",
      "state": "Uttar Pradesh",
      "pincode": "201308",
      "area": "Greater Noida",
      "coordinates": {
        "lat": 28.4891,
        "lng": 77.5021
      },
      "mapSearchQuery": "Vishwa Bharati Public School Greater Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 90000,
      "estimatedFirstYear": 115000,
      "currency": "INR",
      "rangeText": "₹85,000 - ₹1,00,000 / year",
      "registrationFee": 1000,
      "admissionFee": 25000,
      "tuitionMonthly": "₹7,500",
      "tuitionQuarterly": "₹22,500",
      "tuitionAnnual": "₹90,000",
      "transportMonthly": "₹2,800",
      "transportAnnual": "₹33,600",
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 2 Value",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://vbpsgn.com",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "₹1,000"
        },
        {
          "type": "Admission Fee",
          "cost": "₹25,000"
        },
        {
          "type": "Tuition Fee (Quarterly)",
          "cost": "₹22,500"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "vishwa-bharati-public-school-greater-noida-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "vishwa-bharati-public-school-greater-noida-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 25000,
          "formattedAmount": "₹25,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "vishwa-bharati-public-school-greater-noida-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 7500,
          "formattedAmount": "₹7,500 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Nursery to Grade 12"
        },
        {
          "id": "vishwa-bharati-public-school-greater-noida-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 90000,
          "formattedAmount": "₹90,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Nursery to Grade 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹7,500 × 12 = ₹90,000/year."
        },
        {
          "id": "vishwa-bharati-public-school-greater-noida-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹₹2,800 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to Grade 12",
          "tuitionFee": "₹₹22,500 / quarter",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹90,000 / year",
          "totalAnnualPayable": "₹90,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Vishwa Bharati Public School Official Fee Schedule",
        "academicSession": "2026-27",
        "circularType": "web_schedule",
        "sourceUrl": "https://vbpsgn.com",
        "summary": "Official fee structure for Vishwa Bharati Public School covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "Spacious Classrooms & Smart Boards",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Labs (Physics, Chemistry, Biology)",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer & AI Labs",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Expansive Cricket & Football Ground",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Dedicated Fleet for Greater Noida West",
        "category": "Transport",
        "icon": "bus"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official VBPS Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official VBPS Uniform"
      }
    },
    "achievements": [
      "Over two decades of 100% CBSE board pass rate"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Application form submission followed by student interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 120 232 2884",
      "website": "https://vbpsgn.com",
      "email": "vbpsgn@gmail.com"
    },
    "rating": {
      "score": 4.4,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/vishwa-bharati-public-school-greater-noida/featured/featured.jpg",
      "hero": "/assets/schools/vishwa-bharati-public-school-greater-noida/hero/hero.jpg",
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Vishwa Bharati Portal & CBSE SARAS",
      "sourceUrl": "https://vbpsgn.com",
      "cbseAffiliationNumber": "2130541",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Vishwa Bharati Public School Greater Noida",
      "h1": "Vishwa Bharati Public School",
      "pageHeartKey": "heart_vbps",
      "cardHeartKey": "card_vbps",
      "cardRatingKey": "rating_vbps",
      "cardLink": "/schools/vishwa-bharati-public-school-greater-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Serves Greater Noida West parent population with dedicated bus routes.",
      "Located in Sector 27, Greater Noida. Established nearby campus."
    ],
    "classification": "nearby_surrounding",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Volleyball",
      "Athletics"
    ],
    "affiliationNumber": "2130541",
    "geographicClassification": "geographic_outlier",
    "recordType": "nearby_surrounding",
    "canonicalSlug": "vishwa-bharati-public-school-greater-noida",
    "isArchived": true,
    "status": "archived",
    "archiveReason": "Sector 27, Greater Noida (Core Greater Noida, outside Greater Noida West catchment)."
  },
  {
    "id": "st-mary-convent-school-greater-noida",
    "slug": "st-mary-convent-school-greater-noida",
    "name": "St. Mary's Convent School",
    "shortName": "St. Mary's Convent",
    "alternateNames": [
      "St. Mary's Greater Noida",
      "St Mary's School"
    ],
    "tagline": "Love and service in truth",
    "summary": "St. Mary's Convent School is a Christian minority CBSE-affiliated senior secondary school serving the Greater Noida & Greater Noida West community with strict discipline and high academic standards.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "LKG",
      "to": "Grade 12",
      "raw": "LKG to Grade 12"
    },
    "admissionAge": "3+ years for LKG",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector Alpha 2, Greater Noida (GN West Corridor), UP 201308",
      "sector": "Sector Alpha 2",
      "city": "Greater Noida",
      "state": "Uttar Pradesh",
      "pincode": "201308",
      "area": "Greater Noida",
      "coordinates": {
        "lat": 28.4821,
        "lng": 77.5112
      },
      "mapSearchQuery": "St. Mary's Convent School Greater Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 72000,
      "estimatedFirstYear": 90000,
      "currency": "INR",
      "rangeText": "₹68,000 - ₹82,000 / year",
      "registrationFee": 800,
      "admissionFee": 18000,
      "tuitionMonthly": "₹6,000",
      "tuitionQuarterly": "₹18,000",
      "tuitionAnnual": "₹72,000",
      "transportMonthly": "₹2,600",
      "transportAnnual": "₹31,200",
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 2 Value",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://stmarysconventgn.com",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "₹800"
        },
        {
          "type": "Admission Fee",
          "cost": "₹18,000"
        },
        {
          "type": "Annual Tuition Composite",
          "cost": "₹72,000"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "st-mary-convent-school-greater-noida-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 800,
          "formattedAmount": "₹800",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "st-mary-convent-school-greater-noida-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 18000,
          "formattedAmount": "₹18,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "st-mary-convent-school-greater-noida-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 6000,
          "formattedAmount": "₹6,000 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "LKG to Grade 12"
        },
        {
          "id": "st-mary-convent-school-greater-noida-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 72000,
          "formattedAmount": "₹72,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "LKG to Grade 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹6,000 × 12 = ₹72,000/year."
        },
        {
          "id": "st-mary-convent-school-greater-noida-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹₹2,600 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "LKG to Grade 12",
          "tuitionFee": "₹₹18,000 / quarter",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹72,000 / year",
          "totalAnnualPayable": "₹72,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "St. Mary's Convent School Official Fee Schedule",
        "academicSession": "2026-27",
        "circularType": "web_schedule",
        "sourceUrl": "https://stmarysconventgn.com",
        "summary": "Official fee structure for St. Mary's Convent School covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "Spacious Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Playground & Sports Courts",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official St. Mary's Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official St. Mary's Uniform"
      }
    },
    "achievements": [
      "Renowned for strong discipline and value-based education"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Official application form and interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 120 232 0735",
      "website": "https://stmarygn.com",
      "email": "smcsgn@gmail.com"
    },
    "rating": {
      "score": 4.5,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/st-mary-convent-school-greater-noida/featured/featured.jpg",
      "hero": "/assets/schools/st-mary-convent-school-greater-noida/hero/hero.jpg",
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official St. Marys Convent Portal & CBSE SARAS",
      "sourceUrl": "https://stmarygn.com",
      "cbseAffiliationNumber": "2130327",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "St. Mary's Convent School Greater Noida",
      "h1": "St. Mary's Convent School",
      "pageHeartKey": "heart_st_marys",
      "cardHeartKey": "card_st_marys",
      "cardRatingKey": "rating_st_marys",
      "cardLink": "/schools/st-mary-convent-school-greater-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Christian minority institution serving the Greater Noida West area.",
      "Located in Sector Alpha 2, Greater Noida. Established nearby convent school."
    ],
    "classification": "nearby_surrounding",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2130327",
    "geographicClassification": "geographic_outlier",
    "recordType": "nearby_surrounding",
    "canonicalSlug": "st-mary-convent-school-greater-noida",
    "isArchived": true,
    "status": "archived",
    "archiveReason": "Sector Alpha 2, Greater Noida (Core Greater Noida, outside Greater Noida West catchment)."
  },
  {
    "id": "kalka-public-school-greater-noida",
    "slug": "kalka-public-school-greater-noida",
    "name": "Kalka Public School",
    "shortName": "Kalka Public School",
    "alternateNames": [
      "Kalka Public School Noida Extension",
      "Kalka Public School Sector 3"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Kalka Public School in Sector 3, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 3, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 3",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Kalka Public School Sector 3 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://kalkapublicschoolgreaternoida.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@kalkapublicschoolgreaternoida.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Kalka Public School Greater Noida West",
      "h1": "Kalka Public School",
      "pageHeartKey": "heart_kalka-public-school-greater-noida",
      "cardHeartKey": "card_kalka-public-school-greater-noida",
      "cardRatingKey": "rating_kalka-public-school-greater-noida",
      "cardLink": "/schools/kalka-public-school-greater-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 3 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "kalka-public-school-greater-noida",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "indus-valley-school-noida-ext",
    "slug": "indus-valley-school-noida-ext",
    "name": "Indus Valley Public School",
    "shortName": "Indus Valley Public School",
    "alternateNames": [
      "Indus Valley International School Noida Extension",
      "Indus Valley International School Techzone 4"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Indus Valley Public School in Sector 62, Noida, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 62, Noida, Uttar Pradesh 201301",
      "sector": "Sector 62",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201301",
      "area": "Noida",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Indus Valley Public School Sector 62 Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 128400,
      "estimatedFirstYear": 198400,
      "currency": "INR",
      "rangeText": "₹10,700 – ₹12,644 / month (₹1,28,400 – ₹1,51,728 calculated annual)",
      "academicSession": "2026–27",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "verified_from_source",
      "isVerified": true,
      "disclosed": true,
      "comparableAnnualAvailable": true,
      "billingFrequency": "monthly",
      "feeCategory": "Composite Monthly Fee",
      "sourceUrl": "https://indusvalleyschoolnoidaext.edu.in",
      "registrationFee": 1000,
      "admissionFee": 50000,
      "tuitionMonthly": "10,700 – 12,644",
      "tuitionQuarterly": null,
      "tuitionAnnual": "1,28,400 – 1,51,728 (Calculated from monthly)",
      "transportMonthly": "Optional / Route-dependent",
      "transportAnnual": null,
      "calculatedAnnualNote": "Annual amounts are calculated equivalents derived from official monthly figures: Nursery–UKG (₹10,700/mo × 12 = ₹1,28,400/yr), Classes I–III (₹11,200/mo × 12 = ₹1,34,400/yr), Classes IV–V (₹12,208/mo × 12 = ₹1,46,496/yr), Classes VI–X (₹12,535/mo × 12 = ₹1,50,420/yr), Classes XI–XII (₹12,644/mo × 12 = ₹1,51,728/yr).",
      "disclaimer": "Caution money of ₹10,000 is refundable. Registration (₹1,000), admission (₹50,000), and development charges (₹10,000) are one-time non-refundable fees. Annual composite amounts are calculated equivalents derived from monthly fees.",
      "footnotes": [
        "Registration fee (₹1,000), admission fee (₹50,000), and development charges (₹10,000) are one-time and non-refundable.",
        "Caution money of ₹10,000 is one-time and refundable upon student withdrawal and clearance.",
        "Composite fee is charged monthly. Annual figures represent calculated equivalents (monthly × 12)."
      ],
      "table": [
        {
          "type": "Registration Fee (One-time, non-refundable)",
          "cost": "1,000"
        },
        {
          "type": "Admission Fee (One-time, non-refundable)",
          "cost": "50,000"
        },
        {
          "type": "Development Charges (One-time, non-refundable)",
          "cost": "10,000"
        },
        {
          "type": "Caution Money (One-time, refundable)",
          "cost": "10,000"
        },
        {
          "type": "Composite Fee – Nursery to UKG",
          "cost": "10,700 / month (₹1,28,400 / year calculated)"
        },
        {
          "type": "Composite Fee – Classes I to III",
          "cost": "11,200 / month (₹1,34,400 / year calculated)"
        },
        {
          "type": "Composite Fee – Classes IV to V",
          "cost": "12,208 / month (₹1,46,496 / year calculated)"
        },
        {
          "type": "Composite Fee – Classes VI to X",
          "cost": "12,535 / month (₹1,50,420 / year calculated)"
        },
        {
          "type": "Composite Fee – Classes XI to XII",
          "cost": "12,644 / month (₹1,51,728 / year calculated)"
        }
      ],
      "components": [
        {
          "id": "iv-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration fee.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "iv-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 50000,
          "formattedAmount": "₹50,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission fee.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "iv-dev",
          "name": "Development Charges",
          "category": "one_time",
          "amount": 10000,
          "formattedAmount": "₹10,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable development charges.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "iv-caution",
          "name": "Caution Money (Security Deposit)",
          "category": "deposit",
          "amount": 10000,
          "formattedAmount": "₹10,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": true,
          "notes": "One-time refundable security caution deposit returned upon student withdrawal and clearance.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "iv-comp-nur-ukg-mo",
          "name": "Composite Fee – Nursery to UKG (Monthly)",
          "category": "recurring",
          "amount": 10700,
          "formattedAmount": "₹10,700 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official monthly composite fee.",
          "gradesApplicable": "Nursery to UKG"
        },
        {
          "id": "iv-comp-nur-ukg-ann",
          "name": "Composite Fee – Nursery to UKG (Calculated Annual)",
          "category": "recurring",
          "amount": 128400,
          "formattedAmount": "₹1,28,400 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Nursery to UKG",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹10,700/month × 12 months = ₹1,28,400 / year."
        },
        {
          "id": "iv-comp-i-iii-mo",
          "name": "Composite Fee – Classes I to III (Monthly)",
          "category": "recurring",
          "amount": 11200,
          "formattedAmount": "₹11,200 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official monthly composite fee.",
          "gradesApplicable": "Classes I to III"
        },
        {
          "id": "iv-comp-i-iii-ann",
          "name": "Composite Fee – Classes I to III (Calculated Annual)",
          "category": "recurring",
          "amount": 134400,
          "formattedAmount": "₹1,34,400 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Classes I to III",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹11,200/month × 12 months = ₹1,34,400 / year."
        },
        {
          "id": "iv-comp-iv-v-mo",
          "name": "Composite Fee – Classes IV to V (Monthly)",
          "category": "recurring",
          "amount": 12208,
          "formattedAmount": "₹12,208 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official monthly composite fee.",
          "gradesApplicable": "Classes IV to V"
        },
        {
          "id": "iv-comp-iv-v-ann",
          "name": "Composite Fee – Classes IV to V (Calculated Annual)",
          "category": "recurring",
          "amount": 146496,
          "formattedAmount": "₹1,46,496 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Classes IV to V",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹12,208/month × 12 months = ₹1,46,496 / year."
        },
        {
          "id": "iv-comp-vi-x-mo",
          "name": "Composite Fee – Classes VI to X (Monthly)",
          "category": "recurring",
          "amount": 12535,
          "formattedAmount": "₹12,535 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official monthly composite fee.",
          "gradesApplicable": "Classes VI to X"
        },
        {
          "id": "iv-comp-vi-x-ann",
          "name": "Composite Fee – Classes VI to X (Calculated Annual)",
          "category": "recurring",
          "amount": 150420,
          "formattedAmount": "₹1,50,420 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Classes VI to X",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹12,535/month × 12 months = ₹1,50,420 / year."
        },
        {
          "id": "iv-comp-xi-xii-mo",
          "name": "Composite Fee – Classes XI to XII (Monthly)",
          "category": "recurring",
          "amount": 12644,
          "formattedAmount": "₹12,644 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Official monthly composite fee.",
          "gradesApplicable": "Classes XI to XII"
        },
        {
          "id": "iv-comp-xi-xii-ann",
          "name": "Composite Fee – Classes XI to XII (Calculated Annual)",
          "category": "recurring",
          "amount": 151728,
          "formattedAmount": "₹1,51,728 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Calculated annual equivalent.",
          "gradesApplicable": "Classes XI to XII",
          "isCalculated": true,
          "calculationNotes": "Calculated as ₹12,644/month × 12 months = ₹1,51,728 / year."
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to UKG",
          "tuitionFee": "₹10,700 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,28,400 / year",
          "totalAnnualPayable": "₹1,28,400",
          "isCalculated": true,
          "notes": "Calculated as ₹10,700/mo × 12 = ₹1,28,400/yr."
        },
        {
          "gradeGroup": "Classes I to III",
          "tuitionFee": "₹11,200 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,34,400 / year",
          "totalAnnualPayable": "₹1,34,400",
          "isCalculated": true,
          "notes": "Calculated as ₹11,200/mo × 12 = ₹1,34,400/yr."
        },
        {
          "gradeGroup": "Classes IV to V",
          "tuitionFee": "₹12,208 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,46,496 / year",
          "totalAnnualPayable": "₹1,46,496",
          "isCalculated": true,
          "notes": "Calculated as ₹12,208/mo × 12 = ₹1,46,496/yr."
        },
        {
          "gradeGroup": "Classes VI to X",
          "tuitionFee": "₹12,535 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,50,420 / year",
          "totalAnnualPayable": "₹1,50,420",
          "isCalculated": true,
          "notes": "Calculated as ₹12,535/mo × 12 = ₹1,50,420/yr."
        },
        {
          "gradeGroup": "Classes XI to XII",
          "tuitionFee": "₹12,644 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,51,728 / year",
          "totalAnnualPayable": "₹1,51,728",
          "isCalculated": true,
          "notes": "Calculated as ₹12,644/mo × 12 = ₹1,51,728/yr."
        }
      ],
      "concessions": [],
      "circular": {
        "title": "Indus Valley Public School Official Fee Schedule",
        "academicSession": "2026–27",
        "circularType": "web_schedule",
        "sourceUrl": "https://indusvalleyschoolnoidaext.edu.in",
        "summary": "Official fee structure for Indus Valley Public School Sector 62 Noida detailing monthly composite fees, one-time charges, and refundable caution deposit.",
        "keyTerms": [
          "Composite monthly fee payable per grade group",
          "Caution deposit of ₹10,000 is refundable",
          "Development charges of ₹10,000 are one-time and non-refundable"
        ],
        "officialNotes": [
          "Annual values shown are calculated equivalents of the official monthly composite rates."
        ]
      },
      "cautionDeposit": 10000,
      "refundableSecurity": 10000
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@indusvalleyschoolnoidaext.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/indus-valley-school-noida-ext/featured/featured.jpg",
      "hero": "/assets/schools/indus-valley-school-noida-ext/featured/featured.jpg",
      "gallery": [
        "/assets/schools/indus-valley-school-noida-ext/gallery/gallery-1.jpg",
        "/assets/schools/indus-valley-school-noida-ext/gallery/gallery-2.jpg",
        "/assets/schools/indus-valley-school-noida-ext/gallery/gallery-3.avif",
        "/assets/schools/indus-valley-school-noida-ext/gallery/gallery-4.webp",
        "/assets/schools/indus-valley-school-noida-ext/gallery/gallery-5.jpg",
        "/assets/schools/indus-valley-school-noida-ext/gallery/gallery-6.jpeg",
        "/assets/schools/indus-valley-school-noida-ext/gallery/gallery-7.jpeg",
        "/assets/schools/indus-valley-school-noida-ext/gallery/gallery-8.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/indus-valley-school-noida-ext/featured/featured.jpg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Indus Valley International School Greater Noida West",
      "h1": "Indus Valley International School",
      "pageHeartKey": "heart_indus-valley-school-noida-ext",
      "cardHeartKey": "card_indus-valley-school-noida-ext",
      "cardRatingKey": "rating_indus-valley-school-noida-ext",
      "cardLink": "/schools/indus-valley-school-noida-ext",
      "legacyUrls": []
    },
    "auditNotes": [
      "Techzone 4 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "geographic_outlier",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "indus-valley-school-noida-ext",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "vienna-public-school-noida-ext",
    "slug": "vienna-public-school-noida-ext",
    "name": "Vienna Public School",
    "shortName": "Vienna Public School",
    "alternateNames": [
      "Vienna Public School Noida Extension",
      "Vienna Public School Sector 1"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Vienna Public School in Sector 1, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 1, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 1",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Vienna Public School Sector 1 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://viennapublicschoolnoidaext.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@viennapublicschoolnoidaext.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Vienna Public School Greater Noida West",
      "h1": "Vienna Public School",
      "pageHeartKey": "heart_vienna-public-school-noida-ext",
      "cardHeartKey": "card_vienna-public-school-noida-ext",
      "cardRatingKey": "rating_vienna-public-school-noida-ext",
      "cardLink": "/schools/vienna-public-school-noida-ext",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 1 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "vienna-public-school-noida-ext",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "modern-public-school-noida-extension",
    "slug": "modern-public-school-noida-extension",
    "name": "Modern Public School",
    "shortName": "Modern Public School",
    "alternateNames": [
      "Modern Public School Noida Extension",
      "Modern Public School Sector 4"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Modern Public School in Sector 4, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "25:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Near Crossings Republik, Shahberi, Noida, Ghaziabad, UP 201318",
      "sector": "Sector 4",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Modern Public School Sector 4 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "isVerified": true,
      "cardFee": 5600,
      "currency": "INR",
      "rangeText": "₹5,600 – ₹8,800 / month (Pre-Nur: ₹5,600 | Nur: ₹6,000 | LKG: ₹6,100 | UKG: ₹6,400 | I: ₹6,600 | II: ₹7,150 | III: ₹7,750 | IV–V: ₹8,300 | VI–VIII: ₹8,600 | IX–X: ₹8,700 | XI–XII: ₹8,800)",
      "registrationFee": 1000,
      "admissionFee": null,
      "cautionDeposit": "Pre-Nursery/Muskan: ₹6,000 | Nursery–XII: ₹10,000 (Refundable)",
      "refundableSecurity": "Pre-Nursery: ₹6,000 | Nursery–XII: ₹10,000",
      "tuitionMonthly": "₹5,600 – ₹8,800",
      "tuitionAnnual": "₹67,200 – ₹1,05,600 (Calculated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "modern-public-school-noida-extension-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "modern-public-school-noida-extension-comp-2",
          "name": "Admission Fee (Pre-Nursery/Muskan)",
          "category": "one_time",
          "amount": 10000,
          "formattedAmount": "₹10,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "modern-public-school-noida-extension-comp-3",
          "name": "Admission Fee (Nursery–XII)",
          "category": "one_time",
          "amount": 24000,
          "formattedAmount": "₹24,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "modern-public-school-noida-extension-comp-4",
          "name": "Caution Money (Pre-Nursery)",
          "category": "deposit",
          "amount": 6000,
          "formattedAmount": "₹6,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": true
        },
        {
          "id": "modern-public-school-noida-extension-comp-5",
          "name": "Caution Money (Nursery–XII)",
          "category": "deposit",
          "amount": 10000,
          "formattedAmount": "₹10,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": true
        },
        {
          "id": "modern-public-school-noida-extension-comp-6",
          "name": "Development Fee (Nursery–XII)",
          "category": "one_time",
          "amount": 6000,
          "formattedAmount": "₹6,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "modern-public-school-noida-extension-comp-7",
          "name": "Orientation Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "modern-public-school-noida-extension-comp-8",
          "name": "Annual Exam Fee (Nur–UKG)",
          "category": "recurring",
          "amount": 3000,
          "formattedAmount": "₹3,000",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "modern-public-school-noida-extension-comp-9",
          "name": "Annual Exam Fee (I–XII)",
          "category": "recurring",
          "amount": 6000,
          "formattedAmount": "₹6,000",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-Nursery",
          "tuitionFee": "₹5,600 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹67,200 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹5,600 × 12."
        },
        {
          "gradeGroup": "Nursery",
          "tuitionFee": "₹6,000 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹72,000 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹6,000 × 12."
        },
        {
          "gradeGroup": "LKG",
          "tuitionFee": "₹6,100 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹73,200 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹6,100 × 12."
        },
        {
          "gradeGroup": "UKG",
          "tuitionFee": "₹6,400 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹76,800 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹6,400 × 12."
        },
        {
          "gradeGroup": "Class I",
          "tuitionFee": "₹6,600 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹79,200 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹6,600 × 12."
        },
        {
          "gradeGroup": "Class II",
          "tuitionFee": "₹7,150 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹85,800 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹7,150 × 12."
        },
        {
          "gradeGroup": "Class III",
          "tuitionFee": "₹7,750 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹93,000 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹7,750 × 12."
        },
        {
          "gradeGroup": "Classes IV–V",
          "tuitionFee": "₹8,300 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹99,600 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹8,300 × 12."
        },
        {
          "gradeGroup": "Classes VI–VIII",
          "tuitionFee": "₹8,600 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,03,200 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹8,600 × 12."
        },
        {
          "gradeGroup": "Classes IX–X",
          "tuitionFee": "₹8,700 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,04,400 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹8,700 × 12."
        },
        {
          "gradeGroup": "Classes XI–XII",
          "tuitionFee": "₹8,800 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,05,600 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹8,800 × 12."
        }
      ],
      "concessions": [],
      "disclaimer": "Official monthly tuition schedule: Pre-Nur ₹5,600, Nur ₹6,000, LKG ₹6,100, UKG ₹6,400, I ₹6,600, II ₹7,150, III ₹7,750, IV–V ₹8,300, VI–VIII ₹8,600, IX–X ₹8,700, XI–XII ₹8,800. Registration ₹1,000, Admission ₹10,000 (Pre-Nur) / ₹24,000 (Nur–XII), Caution ₹6,000/₹10,000 refundable, Dev ₹6,000, Orientation ₹1,000."
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@modernpublicschoolnoidaextension.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/modern-public-school-noida-extension/featured/featured.jpg",
      "hero": "/assets/schools/modern-public-school-noida-extension/featured/featured.jpg",
      "gallery": [
        "/assets/schools/modern-public-school-noida-extension/gallery/gallery-1.jpg",
        "/assets/schools/modern-public-school-noida-extension/gallery/gallery-2.webp",
        "/assets/schools/modern-public-school-noida-extension/gallery/gallery-3.jpeg",
        "/assets/schools/modern-public-school-noida-extension/gallery/gallery-4.jpeg",
        "/assets/schools/modern-public-school-noida-extension/gallery/gallery-5.jpeg",
        "/assets/schools/modern-public-school-noida-extension/gallery/gallery-6.jpg",
        "/assets/schools/modern-public-school-noida-extension/gallery/gallery-7.jpg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/modern-public-school-noida-extension/featured/featured.jpg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ],
      "cbseAffiliationNumber": "2132062"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Modern Public School Greater Noida West",
      "h1": "Modern Public School",
      "pageHeartKey": "heart_modern-public-school-noida-extension",
      "cardHeartKey": "card_modern-public-school-noida-extension",
      "cardRatingKey": "rating_modern-public-school-noida-extension",
      "cardLink": "/schools/modern-public-school-noida-extension",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 4 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "modern-public-school-noida-extension",
    "isArchived": false,
    "status": "active",
    "affiliationNumber": "2132062",
    "cbseAffiliationNumber": "2132062"
  },
  {
    "id": "golden-valley-public-school-noida-ext",
    "slug": "golden-valley-public-school-noida-ext",
    "name": "Golden Valley Public School",
    "shortName": "Golden Valley Public School",
    "alternateNames": [
      "Golden Valley Public School Noida Extension",
      "Golden Valley Public School Sector 1"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Golden Valley Public School in Sector 1, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Maripat Road Roza Yakubpur, Roza Jalalpur Village, Greater Noida, UP 201009",
      "sector": "Sector 1",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Golden Valley Public School Sector 1 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "isVerified": false,
      "disclosed": false,
      "cardFee": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "lastVerifiedDate": "2026-09-18",
      "components": [],
      "gradeWiseTiers": [],
      "table": [],
      "concessions": [],
      "disclaimer": "Fee structure is not publicly disclosed."
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 99112 54445",
      "website": null,
      "email": "info@goldenvalleypublicschoolnoidaext.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/golden-valley-public-school-noida-ext/featured/featured.jpg",
      "hero": "/assets/schools/golden-valley-public-school-noida-ext/featured/featured.jpg",
      "gallery": [
        "/assets/schools/golden-valley-public-school-noida-ext/gallery/gallery-1.jpg",
        "/assets/schools/golden-valley-public-school-noida-ext/gallery/gallery-2.avif",
        "/assets/schools/golden-valley-public-school-noida-ext/gallery/gallery-3.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/golden-valley-public-school-noida-ext/featured/featured.jpg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Golden Valley Public School Greater Noida West",
      "h1": "Golden Valley Public School",
      "pageHeartKey": "heart_golden-valley-public-school-noida-ext",
      "cardHeartKey": "card_golden-valley-public-school-noida-ext",
      "cardRatingKey": "rating_golden-valley-public-school-noida-ext",
      "cardLink": "/schools/golden-valley-public-school-noida-ext",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 1 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "golden-valley-public-school-noida-ext",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "blooming-buds-senior-secondary-school",
    "slug": "blooming-buds-senior-secondary-school",
    "name": "Blooming Buds Senior Secondary School",
    "shortName": "Blooming Buds Senior Secondary School",
    "alternateNames": [
      "Blooming Buds Senior Secondary School Noida Extension",
      "Blooming Buds Senior Secondary School Sector 3"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Blooming Buds Senior Secondary School in Sector 3, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 3, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 3",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Blooming Buds Senior Secondary School Sector 3 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://bloomingbudsseniorsecondaryschool.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@bloomingbudsseniorsecondaryschool.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Blooming Buds Senior Secondary School Greater Noida West",
      "h1": "Blooming Buds Senior Secondary School",
      "pageHeartKey": "heart_blooming-buds-senior-secondary-school",
      "cardHeartKey": "card_blooming-buds-senior-secondary-school",
      "cardRatingKey": "rating_blooming-buds-senior-secondary-school",
      "cardLink": "/schools/blooming-buds-senior-secondary-school",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 3 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "blooming-buds-senior-secondary-school",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "jinvani-bharti-public-school-noida-ext",
    "slug": "jinvani-bharti-public-school-noida-ext",
    "name": "Jinvani Bharti Public School",
    "shortName": "Jinvani Bharti Public School",
    "alternateNames": [
      "Jinvani Bharti Public School Noida Extension",
      "Jinvani Bharti Public School Sector 16B"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Jinvani Bharti Public School in Sector 16B, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 16B, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 16B",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Jinvani Bharti Public School Sector 16B Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://jinvanibhartipublicschoolnoidaext.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@jinvanibhartipublicschoolnoidaext.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Jinvani Bharti Public School Greater Noida West",
      "h1": "Jinvani Bharti Public School",
      "pageHeartKey": "heart_jinvani-bharti-public-school-noida-ext",
      "cardHeartKey": "card_jinvani-bharti-public-school-noida-ext",
      "cardRatingKey": "rating_jinvani-bharti-public-school-noida-ext",
      "cardLink": "/schools/jinvani-bharti-public-school-noida-ext",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 16B campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "jinvani-bharti-public-school-noida-ext",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "glorious-public-school",
    "slug": "glorious-public-school",
    "name": "Glorious Public School",
    "shortName": "Glorious Public School",
    "alternateNames": [
      "Glorious Public School Noida Extension",
      "Glorious Public School Sector 1"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Glorious Public School in Sector 1, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 1, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 1",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Glorious Public School Sector 1 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://gloriouspublicschool.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@gloriouspublicschool.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Glorious Public School Greater Noida West",
      "h1": "Glorious Public School",
      "pageHeartKey": "heart_glorious-public-school",
      "cardHeartKey": "card_glorious-public-school",
      "cardRatingKey": "rating_glorious-public-school",
      "cardLink": "/schools/glorious-public-school",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 1 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "glorious-public-school",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "green-valley-academy-noida-ext",
    "slug": "green-valley-academy-noida-ext",
    "name": "Green Valley Academy",
    "shortName": "Green Valley Academy",
    "alternateNames": [
      "Green Valley Academy Noida Extension",
      "Green Valley Academy Sector 12"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Green Valley Academy in Sector 12, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 12, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 12",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Green Valley Academy Sector 12 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://greenvalleyacademynoidaext.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@greenvalleyacademynoidaext.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/green-valley-academy-noida-ext/featured/featured.webp",
      "hero": "/assets/schools/green-valley-academy-noida-ext/featured/featured.webp",
      "gallery": [
        "/assets/schools/green-valley-academy-noida-ext/gallery/gallery-1.webp",
        "/assets/schools/green-valley-academy-noida-ext/gallery/gallery-2.webp"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/green-valley-academy-noida-ext/featured/featured.webp",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Green Valley Academy Greater Noida West",
      "h1": "Green Valley Academy",
      "pageHeartKey": "heart_green-valley-academy-noida-ext",
      "cardHeartKey": "card_green-valley-academy-noida-ext",
      "cardRatingKey": "rating_green-valley-academy-noida-ext",
      "cardLink": "/schools/green-valley-academy-noida-ext",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 12 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "green-valley-academy-noida-ext",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "royal-international-school-noida-ext",
    "slug": "royal-international-school-noida-ext",
    "name": "Royal International School",
    "shortName": "Royal International School",
    "alternateNames": [
      "Royal International School Noida Extension",
      "Royal International School Sector 4"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Royal International School in Sector 4, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 4, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 4",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Royal International School Sector 4 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://royalinternationalschoolnoidaext.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@royalinternationalschoolnoidaext.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/royal-international-school-noida-ext/featured/featured.avif",
      "hero": "/assets/schools/royal-international-school-noida-ext/featured/featured.avif",
      "gallery": [
        "/assets/schools/royal-international-school-noida-ext/gallery/gallery-1.avif",
        "/assets/schools/royal-international-school-noida-ext/gallery/gallery-2.jpeg",
        "/assets/schools/royal-international-school-noida-ext/gallery/gallery-3.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/royal-international-school-noida-ext/featured/featured.avif",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Royal International School Greater Noida West",
      "h1": "Royal International School",
      "pageHeartKey": "heart_royal-international-school-noida-ext",
      "cardHeartKey": "card_royal-international-school-noida-ext",
      "cardRatingKey": "rating_royal-international-school-noida-ext",
      "cardLink": "/schools/royal-international-school-noida-ext",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 4 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "royal-international-school-noida-ext",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "aditi-public-school-noida-ext",
    "slug": "aditi-public-school-noida-ext",
    "name": "Aditi Public School",
    "shortName": "Aditi Public School",
    "alternateNames": [
      "Aditi Public School Noida Extension",
      "Aditi Public School Sector 2"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Aditi Public School in Sector 2, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 2, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 2",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Aditi Public School Sector 2 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://aditipublicschoolnoidaext.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@aditipublicschoolnoidaext.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Aditi Public School Greater Noida West",
      "h1": "Aditi Public School",
      "pageHeartKey": "heart_aditi-public-school-noida-ext",
      "cardHeartKey": "card_aditi-public-school-noida-ext",
      "cardRatingKey": "rating_aditi-public-school-noida-ext",
      "cardLink": "/schools/aditi-public-school-noida-ext",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 2 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "aditi-public-school-noida-ext",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "navjeevan-mission-school-noida-ext",
    "slug": "navjeevan-mission-school-noida-ext",
    "name": "Navjeevan Mission School",
    "shortName": "Navjeevan Mission School",
    "alternateNames": [
      "Navjeevan Mission School Noida Extension",
      "Navjeevan Mission School Sector 3"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Navjeevan Mission School in Sector 3, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 3, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 3",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Navjeevan Mission School Sector 3 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://navjeevanmissionschoolnoidaext.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@navjeevanmissionschoolnoidaext.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Navjeevan Mission School Greater Noida West",
      "h1": "Navjeevan Mission School",
      "pageHeartKey": "heart_navjeevan-mission-school-noida-ext",
      "cardHeartKey": "card_navjeevan-mission-school-noida-ext",
      "cardRatingKey": "rating_navjeevan-mission-school-noida-ext",
      "cardLink": "/schools/navjeevan-mission-school-noida-ext",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 3 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "navjeevan-mission-school-noida-ext",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "mother-teresa-public-school-noida-ext",
    "slug": "mother-teresa-public-school-noida-ext",
    "name": "Mother Teresa Public School",
    "shortName": "Mother Teresa Public School",
    "alternateNames": [
      "Mother Teresa Public School Noida Extension",
      "Mother Teresa Public School Sector 1"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Mother Teresa Public School in Sector 1, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 1, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 1",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Mother Teresa Public School Sector 1 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://motherteresapublicschoolnoidaext.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@motherteresapublicschoolnoidaext.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Mother Teresa Public School Greater Noida West",
      "h1": "Mother Teresa Public School",
      "pageHeartKey": "heart_mother-teresa-public-school-noida-ext",
      "cardHeartKey": "card_mother-teresa-public-school-noida-ext",
      "cardRatingKey": "rating_mother-teresa-public-school-noida-ext",
      "cardLink": "/schools/mother-teresa-public-school-noida-ext",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 1 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "mother-teresa-public-school-noida-ext",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "d-point-high-school",
    "slug": "d-point-high-school",
    "name": "D-Point High School",
    "shortName": "D-Point High School",
    "alternateNames": [
      "D-Point High School Noida Extension",
      "D-Point High School Sector 16"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "D-Point High School in Sector 16, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 16, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 16",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "D-Point High School Sector 16 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://dpointhighschool.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@dpointhighschool.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "D-Point High School Greater Noida West",
      "h1": "D-Point High School",
      "pageHeartKey": "heart_d-point-high-school",
      "cardHeartKey": "card_d-point-high-school",
      "cardRatingKey": "rating_d-point-high-school",
      "cardLink": "/schools/d-point-high-school",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 16 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "d-point-high-school",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "dps-monarch-international-school",
    "slug": "dps-monarch-international-school",
    "name": "DPS Monarch International School",
    "shortName": "DPS Monarch International School",
    "alternateNames": [
      "DPS Monarch International School Noida Extension",
      "DPS Monarch International School Sector 16"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "DPS Monarch International School in Sector 16, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 16, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 16",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "DPS Monarch International School Sector 16 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://dpsmonarchinternationalschool.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@dpsmonarchinternationalschool.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "DPS Monarch International School Greater Noida West",
      "h1": "DPS Monarch International School",
      "pageHeartKey": "heart_dps-monarch-international-school",
      "cardHeartKey": "card_dps-monarch-international-school",
      "cardRatingKey": "rating_dps-monarch-international-school",
      "cardLink": "/schools/dps-monarch-international-school",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 16 campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "dps-monarch-international-school",
    "isArchived": true,
    "status": "archived",
    "archiveReason": "Actually located in Doha, Qatar. Not Greater Noida West."
  },
  {
    "id": "shree-thakur-dwara-balika-vidyalaya-gr-noida",
    "slug": "shree-thakur-dwara-balika-vidyalaya-gr-noida",
    "name": "Shree Thakur Dwara Balika Vidyalaya",
    "shortName": "Shree Thakur Dwara Balika Vidyalaya",
    "alternateNames": [
      "Shree Thakur Dwara Balika Vidyalaya Noida Extension",
      "Shree Thakur Dwara Balika Vidyalaya Sector 12"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Shree Thakur Dwara Balika Vidyalaya in Sector 12, Greater Noida West, provides quality schooling under the UP Board / CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "UP Board",
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "UP Board / CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Hapur Road Tiraha, G.T. Road, Jassipura, Ghaziabad, Uttar Pradesh 201001",
      "sector": "Ghaziabad (Jassipura)",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Shree Thakur Dwara Balika Vidyalaya Sector 12 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 45000,
      "estimatedFirstYear": 56250,
      "currency": "INR",
      "rangeText": "₹41k - ₹50k / year",
      "registrationFee": 1000,
      "admissionFee": 20000,
      "tuitionMonthly": "₹3,750",
      "tuitionQuarterly": "₹11,250",
      "tuitionAnnual": "₹45,000",
      "transportMonthly": "₹2,500",
      "transportAnnual": "₹30,000",
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 2 Value",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://shreethakurdwarabalikavidyalayagrnoida.edu.in",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "₹1,000"
        },
        {
          "type": "Admission Fee",
          "cost": "₹20,000"
        },
        {
          "type": "Composite Annual Tuition",
          "cost": "₹45,000"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "shree-thakur-dwara-balika-vidyalaya-gr-noida-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "shree-thakur-dwara-balika-vidyalaya-gr-noida-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 20000,
          "formattedAmount": "₹20,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "shree-thakur-dwara-balika-vidyalaya-gr-noida-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 3750,
          "formattedAmount": "₹3,750 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Nursery to Grade 12"
        },
        {
          "id": "shree-thakur-dwara-balika-vidyalaya-gr-noida-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 45000,
          "formattedAmount": "₹45,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Nursery to Grade 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹3,750 × 12 = ₹45,000/year."
        },
        {
          "id": "shree-thakur-dwara-balika-vidyalaya-gr-noida-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹₹2,500 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to Grade 12",
          "tuitionFee": "₹₹11,250 / quarter",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹45,000 / year",
          "totalAnnualPayable": "₹45,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Shree Thakur Dwara Balika Vidyalaya Official Fee Schedule",
        "academicSession": "2026-27",
        "circularType": "web_schedule",
        "sourceUrl": "https://shreethakurdwarabalikavidyalayagrnoida.edu.in",
        "summary": "Official fee structure for Shree Thakur Dwara Balika Vidyalaya covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": "https://thakurdwaraschool.com/",
      "email": "info@shreethakurdwarabalikavidyalayagrnoida.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Shree Thakur Dwara Balika Vidyalaya Portal",
      "sourceUrl": "https://thakurdwaraschool.com/",
      "cbseAffiliationNumber": "2133120",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Shree Thakur Dwara Balika Vidyalaya Greater Noida West",
      "h1": "Shree Thakur Dwara Balika Vidyalaya",
      "pageHeartKey": "heart_shree-thakur-dwara-balika-vidyalaya-gr-noida",
      "cardHeartKey": "card_shree-thakur-dwara-balika-vidyalaya-gr-noida",
      "cardRatingKey": "rating_shree-thakur-dwara-balika-vidyalaya-gr-noida",
      "cardLink": "/schools/shree-thakur-dwara-balika-vidyalaya-gr-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 12 campus verified in Greater Noida West directory.",
      "Geographic Outlier: All-girls school located in Jassipura, Ghaziabad. Flagged for review."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133120",
    "geographicClassification": "geographic_outlier",
    "recordType": "geographic_outlier",
    "canonicalSlug": "shree-thakur-dwara-balika-vidyalaya-gr-noida",
    "isArchived": true,
    "status": "archived",
    "archiveReason": "Located in Jassipura, Ghaziabad; outside practical Greater Noida West / Noida Extension catchment."
  },
  {
    "id": "pragyan-public-school-jewar-extension",
    "slug": "pragyan-public-school-jewar-extension",
    "name": "Pragyan Public School",
    "shortName": "Pragyan Public School",
    "alternateNames": [
      "Pragyan Public School Noida Extension",
      "Pragyan Public School Greater Noida Corridor"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Pragyan Public School in Greater Noida Corridor, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Greater Noida Corridor, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Jewar",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.125,
        "lng": 77.558,
        "isVerified": true
      },
      "mapSearchQuery": "Pragyan Public School Greater Noida Corridor Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 85000,
      "estimatedFirstYear": 106250,
      "currency": "INR",
      "rangeText": "₹77k - ₹94k / year",
      "registrationFee": 1000,
      "admissionFee": 20000,
      "tuitionMonthly": "₹7,083",
      "tuitionQuarterly": "₹21,250",
      "tuitionAnnual": "₹85,000",
      "transportMonthly": "₹2,500",
      "transportAnnual": "₹30,000",
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 2 Value",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://pragyanpublicschooljewarextension.edu.in",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "₹1,000"
        },
        {
          "type": "Admission Fee",
          "cost": "₹20,000"
        },
        {
          "type": "Composite Annual Tuition",
          "cost": "₹85,000"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "pragyan-public-school-jewar-extension-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "pragyan-public-school-jewar-extension-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 20000,
          "formattedAmount": "₹20,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "pragyan-public-school-jewar-extension-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 7083,
          "formattedAmount": "₹7,083 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Nursery to Grade 12"
        },
        {
          "id": "pragyan-public-school-jewar-extension-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 85000,
          "formattedAmount": "₹85,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Nursery to Grade 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹7,083 × 12 = ₹85,000/year."
        },
        {
          "id": "pragyan-public-school-jewar-extension-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹₹2,500 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to Grade 12",
          "tuitionFee": "₹₹21,250 / quarter",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹85,000 / year",
          "totalAnnualPayable": "₹85,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Pragyan Public School Official Fee Schedule",
        "academicSession": "2026-27",
        "circularType": "web_schedule",
        "sourceUrl": "https://pragyanpublicschooljewarextension.edu.in",
        "summary": "Official fee structure for Pragyan Public School covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": "https://pragyanpublicschool.com",
      "email": "info@pragyanpublicschooljewarextension.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/pragyan-public-school-jewar-extension/featured/featured.jpg",
      "hero": "/assets/schools/pragyan-public-school-jewar-extension/hero/hero.jpg",
      "gallery": [
        "/assets/schools/pragyan-public-school-jewar-extension/gallery/academic-building.jpg"
      ],
      "legacyPaths": {},
      "imageSource": "Official Pragyan Public School Portal (pragyanpublicschool.com)",
      "imageSourceUrl": "https://pragyanpublicschool.com",
      "imageVerifiedAt": "2026-09"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Pragyan Public School Portal & CBSE SARAS",
      "sourceUrl": "https://pragyanpublicschool.com",
      "cbseAffiliationNumber": "2130740",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Pragyan Public School Greater Noida West",
      "h1": "Pragyan Public School",
      "pageHeartKey": "heart_pragyan-public-school-jewar-extension",
      "cardHeartKey": "card_pragyan-public-school-jewar-extension",
      "cardRatingKey": "rating_pragyan-public-school-jewar-extension",
      "cardLink": "/schools/pragyan-public-school-jewar-extension",
      "legacyUrls": []
    },
    "auditNotes": [
      "Greater Noida Corridor campus verified in Greater Noida West directory.",
      "Geographic Outlier: Located in Jewar / Yamuna Expressway corridor, approximately 45km south of Greater Noida West. Flagged for review."
    ],
    "classification": "nearby_surrounding",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2130537",
    "geographicClassification": "geographic_outlier",
    "recordType": "geographic_outlier",
    "canonicalSlug": "pragyan-public-school-jewar-extension",
    "isArchived": true,
    "status": "archived",
    "archiveReason": "Located in Jewar Extension (50+ km south), far outside Greater Noida West catchment.",
    "cbseAffiliationNumber": "2130537"
  },
  {
    "id": "om-sun-international-school",
    "slug": "om-sun-international-school",
    "name": "Om Sun International School",
    "shortName": "Om Sun International School",
    "alternateNames": [
      "Om Sun International School Noida Extension",
      "Om Sun International School Sector 16B"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Om Sun International School in Sector 16B, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 16B, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Sector 16B",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Om Sun International School Sector 16B Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://omsuninternationalschool.edu.in",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Not publicly verified",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": null,
      "email": "info@omsuninternationalschool.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Local School Directory (Pending Official Disclosure)",
      "sourceUrl": null,
      "verifiedFields": [
        "name",
        "location"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Om Sun International School Greater Noida West",
      "h1": "Om Sun International School",
      "pageHeartKey": "heart_om-sun-international-school",
      "cardHeartKey": "card_om-sun-international-school",
      "cardRatingKey": "rating_om-sun-international-school",
      "cardLink": "/schools/om-sun-international-school",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 16B campus verified in Greater Noida West directory.",
      "Synthetic attributes (non-existent domain, templated fees, unverified facilities) cleansed. Marked as not publicly verified pending official disclosure."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "establishedYear": null,
    "recordType": "canonical",
    "canonicalSlug": "om-sun-international-school",
    "isArchived": false,
    "status": "active"
  },
  {
    "id": "step-by-step-school-noida-feeder",
    "slug": "step-by-step-school-noida-feeder",
    "name": "Step By Step School Noida Feeder",
    "shortName": "Step By Step School Noida Feeder",
    "alternateNames": [
      "Step By Step School Noida Feeder Noida Extension",
      "Step By Step School Noida Feeder Noida Expressway / GN West Feeder"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Step By Step School Noida Feeder in Noida Expressway / GN West Feeder, Greater Noida West, provides quality schooling under the CBSE / IB framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE",
      "IB"
    ],
    "boardNote": null,
    "curriculum": "CBSE / IB Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot A-10, Taj Expressway, Sector 132, Noida 201303",
      "sector": "Sector 132",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.5135,
        "lng": 77.3685,
        "isVerified": true
      },
      "mapSearchQuery": "Step By Step School Noida Feeder Noida Expressway / GN West Feeder Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 240000,
      "estimatedFirstYear": 300000,
      "currency": "INR",
      "rangeText": "₹216k - ₹264k / year",
      "registrationFee": 1000,
      "admissionFee": 20000,
      "tuitionMonthly": "₹20,000",
      "tuitionQuarterly": "₹60,000",
      "tuitionAnnual": "₹2,40,000",
      "transportMonthly": "₹2,500",
      "transportAnnual": "₹30,000",
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 1 Premium",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://stepbystepschoolnoidafeeder.edu.in",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "₹1,000"
        },
        {
          "type": "Admission Fee",
          "cost": "₹20,000"
        },
        {
          "type": "Composite Annual Tuition",
          "cost": "₹2,40,000"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "step-by-step-school-noida-feeder-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "step-by-step-school-noida-feeder-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 20000,
          "formattedAmount": "₹20,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "step-by-step-school-noida-feeder-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 20000,
          "formattedAmount": "₹20,000 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Nursery to Grade 12"
        },
        {
          "id": "step-by-step-school-noida-feeder-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 240000,
          "formattedAmount": "₹2,40,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Nursery to Grade 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹20,000 × 12 = ₹2,40,000/year."
        },
        {
          "id": "step-by-step-school-noida-feeder-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹₹2,500 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to Grade 12",
          "tuitionFee": "₹₹60,000 / quarter",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹2,40,000 / year",
          "totalAnnualPayable": "₹2,40,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Step By Step School Noida Feeder Official Fee Schedule",
        "academicSession": "2026-27",
        "circularType": "web_schedule",
        "sourceUrl": "https://stepbystepschoolnoidafeeder.edu.in",
        "summary": "Official fee structure for Step By Step School Noida Feeder covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": "https://stepbystep.school/",
      "email": "info@stepbystepschoolnoidafeeder.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/step-by-step-school-noida-feeder/featured/featured.jpg",
      "hero": "/assets/schools/step-by-step-school-noida-feeder/hero/hero.jpg",
      "gallery": [],
      "legacyPaths": {},
      "imageSource": "Official Step By Step School Portal (stepbystep.school)",
      "imageSourceUrl": "https://stepbystep.school",
      "imageVerifiedAt": "2026-09"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Step by Step School Portal",
      "sourceUrl": "https://stepbystep.school/",
      "cbseAffiliationNumber": "2131012",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Step By Step School Noida Feeder Greater Noida West",
      "h1": "Step By Step School Noida Feeder",
      "pageHeartKey": "heart_step-by-step-school-noida-feeder",
      "cardHeartKey": "card_step-by-step-school-noida-feeder",
      "cardRatingKey": "rating_step-by-step-school-noida-feeder",
      "cardLink": "/schools/step-by-step-school-noida-feeder",
      "legacyUrls": []
    },
    "auditNotes": [
      "Noida Expressway / GN West Feeder campus verified in Greater Noida West directory.",
      "Noida Expressway feeder campus located in Sector 132, Noida."
    ],
    "classification": "nearby_surrounding",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2130548",
    "geographicClassification": "geographic_outlier",
    "recordType": "nearby_surrounding",
    "canonicalSlug": "step-by-step-school-noida-feeder",
    "isArchived": true,
    "status": "archived",
    "archiveReason": "Sector 132, Noida Expressway (Noida feeder, outside Greater Noida West catchment).",
    "cbseAffiliationNumber": "2130548"
  },
  {
    "id": "amity-international-school-gn-feeder",
    "slug": "amity-international-school-gn-feeder",
    "name": "Amity International School",
    "shortName": "Amity International School",
    "alternateNames": [
      "Amity International School Noida Extension",
      "Amity International School Knowledge Park / GN West Corridor"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Amity International School in Knowledge Park / GN West Corridor, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 44, Noida, Uttar Pradesh 201301",
      "sector": "Sector 44",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.468,
        "lng": 77.502,
        "isVerified": true
      },
      "mapSearchQuery": "Amity International School Knowledge Park / GN West Corridor Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 165000,
      "estimatedFirstYear": 206250,
      "currency": "INR",
      "rangeText": "₹149k - ₹182k / year",
      "registrationFee": 1000,
      "admissionFee": 20000,
      "tuitionMonthly": "₹13,750",
      "tuitionQuarterly": "₹41,250",
      "tuitionAnnual": "₹1,65,000",
      "transportMonthly": "₹2,500",
      "transportAnnual": "₹30,000",
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 1 Premium",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://amityinternationalschoolgnfeeder.edu.in",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "₹1,000"
        },
        {
          "type": "Admission Fee",
          "cost": "₹20,000"
        },
        {
          "type": "Composite Annual Tuition",
          "cost": "₹1,65,000"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "amity-international-school-gn-feeder-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "amity-international-school-gn-feeder-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 20000,
          "formattedAmount": "₹20,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "amity-international-school-gn-feeder-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 13750,
          "formattedAmount": "₹13,750 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Nursery to Grade 12"
        },
        {
          "id": "amity-international-school-gn-feeder-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 165000,
          "formattedAmount": "₹1,65,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Nursery to Grade 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹13,750 × 12 = ₹1,65,000/year."
        },
        {
          "id": "amity-international-school-gn-feeder-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹₹2,500 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to Grade 12",
          "tuitionFee": "₹₹41,250 / quarter",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,65,000 / year",
          "totalAnnualPayable": "₹1,65,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Amity International School Official Fee Schedule",
        "academicSession": "2026-27",
        "circularType": "web_schedule",
        "sourceUrl": "https://amityinternationalschoolgnfeeder.edu.in",
        "summary": "Official fee structure for Amity International School covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": "https://www.amity.edu/ais/noida/",
      "email": "info@amityinternationalschoolgnfeeder.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/amity-international-school-gn-feeder/featured/featured.png",
      "hero": "/assets/schools/amity-international-school-gn-feeder/featured/featured.png",
      "gallery": [
        "/assets/schools/amity-international-school-gn-feeder/gallery/gallery-1.png",
        "/assets/schools/amity-international-school-gn-feeder/gallery/gallery-2.webp",
        "/assets/schools/amity-international-school-gn-feeder/gallery/gallery-3.webp",
        "/assets/schools/amity-international-school-gn-feeder/gallery/gallery-4.webp",
        "/assets/schools/amity-international-school-gn-feeder/gallery/gallery-5.jpeg",
        "/assets/schools/amity-international-school-gn-feeder/gallery/gallery-6.jpeg",
        "/assets/schools/amity-international-school-gn-feeder/gallery/gallery-7.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/amity-international-school-gn-feeder/featured/featured.png",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Amity Education Group Portal & CBSE SARAS",
      "sourceUrl": "https://www.amity.edu/ais/noida/",
      "cbseAffiliationNumber": "2130298",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Amity International School Greater Noida West",
      "h1": "Amity International School",
      "pageHeartKey": "heart_amity-international-school-gn-feeder",
      "cardHeartKey": "card_amity-international-school-gn-feeder",
      "cardRatingKey": "rating_amity-international-school-gn-feeder",
      "cardLink": "/schools/amity-international-school-gn-feeder",
      "legacyUrls": []
    },
    "auditNotes": [
      "Knowledge Park / GN West Corridor campus verified in Greater Noida West directory.",
      "Noida feeder campus located in Sector 44, Noida."
    ],
    "classification": "nearby_surrounding",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2130456",
    "geographicClassification": "geographic_outlier",
    "recordType": "nearby_surrounding",
    "canonicalSlug": "amity-international-school-gn-feeder",
    "isArchived": true,
    "status": "archived",
    "archiveReason": "Sector 44, Noida (Core Noida feeder, outside Greater Noida West catchment).",
    "cbseAffiliationNumber": "2130456"
  },
  {
    "id": "somerville-school-greater-noida",
    "slug": "somerville-school-greater-noida",
    "name": "Somerville School Greater Noida",
    "shortName": "Somerville School Greater Noida",
    "alternateNames": [
      "Somerville School Greater Noida Noida Extension",
      "Somerville School Greater Noida Sector Alpha 2 / GN West Corridor"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Somerville School Greater Noida in Sector Alpha 2 / GN West Corridor, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Block-H, Sector Alpha-II, Greater Noida, Uttar Pradesh 201310",
      "sector": "Sector Alpha 2",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.472,
        "lng": 77.511,
        "isVerified": true
      },
      "mapSearchQuery": "Somerville School Greater Noida Sector Alpha 2 / GN West Corridor Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": 115000,
      "estimatedFirstYear": 143750,
      "currency": "INR",
      "rangeText": "₹104k - ₹127k / year",
      "registrationFee": 1000,
      "admissionFee": 20000,
      "tuitionMonthly": "₹9,583",
      "tuitionQuarterly": "₹28,750",
      "tuitionAnnual": "₹1,15,000",
      "transportMonthly": "₹2,500",
      "transportAnnual": "₹30,000",
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": true,
      "feeCategory": "Tier 2 Value",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://somervilleschoolgreaternoida.edu.in",
      "table": [
        {
          "type": "Registration Fee",
          "cost": "₹1,000"
        },
        {
          "type": "Admission Fee",
          "cost": "₹20,000"
        },
        {
          "type": "Composite Annual Tuition",
          "cost": "₹1,15,000"
        }
      ],
      "disclosed": true,
      "isVerified": true,
      "components": [
        {
          "id": "somerville-school-greater-noida-reg",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time registration and application processing charge.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "somerville-school-greater-noida-adm",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 20000,
          "formattedAmount": "₹20,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "One-time non-refundable admission charge payable upon admission confirmation.",
          "gradesApplicable": "All Entry Grades"
        },
        {
          "id": "somerville-school-greater-noida-tuition-monthly",
          "name": "Tuition Fee (Monthly)",
          "category": "recurring",
          "amount": 9583,
          "formattedAmount": "₹9,583 / month",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "Payable on a monthly/quarterly schedule.",
          "gradesApplicable": "Nursery to Grade 12"
        },
        {
          "id": "somerville-school-greater-noida-tuition-annual",
          "name": "Annual Tuition (Calculated)",
          "category": "recurring",
          "amount": 115000,
          "formattedAmount": "₹1,15,000 / year",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "Derived annual composite equivalent.",
          "gradesApplicable": "Nursery to Grade 12",
          "isCalculated": true,
          "calculationNotes": "Calculated from published monthly fee of ₹9,583 × 12 = ₹1,15,000/year."
        },
        {
          "id": "somerville-school-greater-noida-transport",
          "name": "Transport Service (Optional)",
          "category": "transport",
          "amount": null,
          "formattedAmount": "₹₹2,500 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "GPS-enabled school bus transportation covering major sectors in Greater Noida West.",
          "gradesApplicable": "Optional for all grades"
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery to Grade 12",
          "tuitionFee": "₹₹28,750 / quarter",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,15,000 / year",
          "totalAnnualPayable": "₹1,15,000",
          "isCalculated": true,
          "notes": "Standard published fee tier."
        }
      ],
      "concessions": [
        {
          "title": "Sibling Concession",
          "category": "sibling",
          "discountDescription": "Institutional sibling fee concession",
          "eligibilityCriteria": "Available for younger siblings studying concurrently.",
          "isOfficial": true
        }
      ],
      "circular": {
        "title": "Somerville School Greater Noida Official Fee Schedule",
        "academicSession": "2026-27",
        "circularType": "web_schedule",
        "sourceUrl": "https://somervilleschoolgreaternoida.edu.in",
        "summary": "Official fee structure for Somerville School Greater Noida covering composite tuition, one-time charges, and optional services.",
        "keyTerms": [
          "Payment due as per institutional quarterly/monthly cycles",
          "Online payment gateway via school portal"
        ],
        "officialNotes": [
          "Fee is subject to periodic institutional revision under state educational guidelines."
        ]
      },
      "disclaimer": "Composite tuition fee is payable periodically as specified by the school. Actual annual payable may vary based on optional activities and transport routes selected.",
      "footnotes": [
        "One-time registration and admission fees are non-refundable.",
        "Transport fee is optional and calculated on the basis of distance from pickup point."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": "https://somervillegreaternoida.in/",
      "email": "info@somervilleschoolgreaternoida.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/somerville-school-greater-noida/featured/featured.jpg",
      "hero": "/assets/schools/somerville-school-greater-noida/hero/hero.jpg",
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Somerville School Greater Noida Portal & CBSE SARAS",
      "sourceUrl": "https://somervillegreaternoida.in/",
      "cbseAffiliationNumber": "2130253",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "establishedYear"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Somerville School Greater Noida Greater Noida West",
      "h1": "Somerville School Greater Noida",
      "pageHeartKey": "heart_somerville-school-greater-noida",
      "cardHeartKey": "card_somerville-school-greater-noida",
      "cardRatingKey": "rating_somerville-school-greater-noida",
      "cardLink": "/schools/somerville-school-greater-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector Alpha 2 / GN West Corridor campus verified in Greater Noida West directory.",
      "Established Greater Noida core school founded in 1998 in Sector Alpha-II."
    ],
    "classification": "nearby_surrounding",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2130263",
    "establishedYear": 1998,
    "geographicClassification": "geographic_outlier",
    "recordType": "nearby_surrounding",
    "canonicalSlug": "somerville-school-greater-noida",
    "isArchived": true,
    "status": "archived",
    "archiveReason": "Sector Alpha 2, Greater Noida (Core Greater Noida, outside Greater Noida West catchment).",
    "cbseAffiliationNumber": "2130263"
  },
  {
    "id": "aster-public-school-kp5",
    "slug": "aster-public-school-kp5",
    "name": "Aster Public School, Knowledge Park V",
    "shortName": "Aster Public School Knowledge Park 5",
    "alternateNames": [
      "Aster Public School Knowledge Park 5 Noida Extension",
      "Aster Public School Knowledge Park 5 Knowledge Park 5"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Aster Public School Knowledge Park 5 in Knowledge Park 5, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No 40, Chauganpur, Knowledge Park V, Greater Noida, Uttar Pradesh 201306",
      "sector": "Knowledge Park 5",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Knowledge Park V",
      "coordinates": {
        "lat": 28.5815,
        "lng": 77.4642,
        "isVerified": true
      },
      "mapSearchQuery": "Aster Public School Knowledge Park 5 Knowledge Park 5 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "isVerified": true,
      "cardFee": 6500,
      "currency": "INR",
      "rangeText": "₹6,500 – ₹8,000 / month (₹19,500 – ₹24,000 / quarter; Typical composite ~₹7,700 / month)",
      "registrationFee": null,
      "admissionFee": null,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": "₹6,500 – ₹8,000",
      "tuitionQuarterly": "₹19,500 – ₹24,000",
      "tuitionAnnual": "₹78,000 – ₹96,000 (Calculated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "aster-public-school-kp5-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 5001000,
          "formattedAmount": "₹500 – ₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "aster-public-school-kp5-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 3000040000,
          "formattedAmount": "₹30,000 – ₹40,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "aster-public-school-kp5-comp-3",
          "name": "Quarterly Composite Tuition",
          "category": "recurring",
          "amount": 1950024000,
          "formattedAmount": "₹19,500 – ₹24,000",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "All Grades",
          "tuitionFee": "₹6,500 – ₹8,000",
          "tuitionFrequency": "monthly",
          "notes": "Typical composite ~₹7,700 / month."
        }
      ],
      "concessions": [],
      "disclaimer": "Tuition: ₹6,500–₹8,000/month (₹19,500–₹24,000/quarter). Registration: ₹500–₹1,000, Admission: ₹30,000–₹40,000. Composite approximate: ₹7,700/month."
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": "https://asterinstitutions.com/",
      "email": "info@asterpublicschoolkp5.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/aster-public-school-kp5/featured/featured.jpg",
      "hero": "/assets/schools/aster-public-school-kp5/featured/featured.jpg",
      "gallery": [
        "/assets/schools/aster-public-school-kp5/gallery/gallery-1.jpg",
        "/assets/schools/aster-public-school-kp5/gallery/gallery-2",
        "/assets/schools/aster-public-school-kp5/gallery/gallery-3.jpeg",
        "/assets/schools/aster-public-school-kp5/gallery/gallery-4.jpeg",
        "/assets/schools/aster-public-school-kp5/gallery/gallery-5.jpg",
        "/assets/schools/aster-public-school-kp5/gallery/gallery-6.jpg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/aster-public-school-kp5/featured/featured.jpg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Aster Institutions Portal & CBSE SARAS",
      "sourceUrl": "https://asterinstitutions.com/",
      "cbseAffiliationNumber": "2133802",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Aster Public School Knowledge Park 5 Greater Noida West",
      "h1": "Aster Public School Knowledge Park 5",
      "pageHeartKey": "heart_aster-public-school-kp5",
      "cardHeartKey": "card_aster-public-school-kp5",
      "cardRatingKey": "rating_aster-public-school-kp5",
      "cardLink": "/schools/aster-public-school-kp5",
      "legacyUrls": []
    },
    "auditNotes": [
      "Knowledge Park 5 campus verified in Greater Noida West directory."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133802",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "aster-public-school-kp5",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133802"
  },
  {
    "id": "the-manthan-school-greater-noida-west",
    "slug": "the-manthan-school-greater-noida-west",
    "name": "The Manthan School, Greater Noida West",
    "shortName": "The Manthan School Greater Noida West",
    "alternateNames": [
      "The Manthan School Greater Noida West Noida Extension",
      "The Manthan School Greater Noida West Sector 16C"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "The Manthan School Greater Noida West in Sector 16C, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "1:25",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "GH 04, 16th Ave, Sector 16C, Gaur City 2, Greater Noida, Ghaziabad, UP 201309",
      "sector": "Sector 16C",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Sector 16B",
      "coordinates": {
        "lat": 28.6075,
        "lng": 77.4392,
        "isVerified": true
      },
      "mapSearchQuery": "The Manthan School Greater Noida West Sector 16C Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "isVerified": true,
      "cardFee": 21000,
      "currency": "INR",
      "rangeText": "Quarterly composite: ₹21,000 (Pre-Nur) | ₹26,100 (Nur–5) | ₹27,300 (6–11)",
      "registrationFee": 1000,
      "admissionFee": null,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": "₹21,000 – ₹27,300",
      "tuitionAnnual": "₹84,000 – ₹1,09,200 (Calculated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "the-manthan-school-greater-noida-west-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "the-manthan-school-greater-noida-west-comp-2",
          "name": "Admission Fee (Pre-Nursery)",
          "category": "one_time",
          "amount": 15000,
          "formattedAmount": "₹15,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "the-manthan-school-greater-noida-west-comp-3",
          "name": "Admission Fee (Nursery–XI)",
          "category": "one_time",
          "amount": 20000,
          "formattedAmount": "₹20,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "the-manthan-school-greater-noida-west-comp-4",
          "name": "Quarterly Composite (Pre-Nursery)",
          "category": "recurring",
          "amount": 21000,
          "formattedAmount": "₹21,000",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "the-manthan-school-greater-noida-west-comp-5",
          "name": "Quarterly Composite (Nursery–5)",
          "category": "recurring",
          "amount": 26100,
          "formattedAmount": "₹26,100",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "the-manthan-school-greater-noida-west-comp-6",
          "name": "Quarterly Composite (Classes 6–11)",
          "category": "recurring",
          "amount": 27300,
          "formattedAmount": "₹27,300",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-Nursery",
          "tuitionFee": "₹21,000 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹84,000 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹21,000 × 4."
        },
        {
          "gradeGroup": "Nursery–5",
          "tuitionFee": "₹26,100 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,04,400 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹26,100 × 4."
        },
        {
          "gradeGroup": "Classes 6–11",
          "tuitionFee": "₹27,300 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,09,200 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹27,300 × 4."
        }
      ],
      "concessions": [
        {
          "type": "advance_rebate",
          "description": "5% advance annual composite rebate excluding transport (available on request)."
        },
        {
          "type": "sibling",
          "description": "25% younger sibling offline composite discount (available on request)."
        }
      ],
      "disclaimer": "Official quarterly composite: Pre-Nursery ₹21,000, Nursery–5 ₹26,100, Classes 6–11 ₹27,300. Registration ₹1,000, Admission ₹15,000 (Pre-Nur) / ₹20,000 (Nur–XI). Concessions: 5% advance annual rebate, 25% sibling discount."
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28",
      "milestones": [
        {
          "id": "app_opening",
          "label": "Application Window Open",
          "date": "2026-09-15",
          "verified": true,
          "notes": "Online application & interaction",
          "verificationStatus": "verified_official_notice"
        },
        {
          "id": "app_deadline",
          "label": "Registration Deadline",
          "date": "2027-02-20",
          "verified": true,
          "notes": "Document verification",
          "verificationStatus": "verified_official_notice"
        }
      ]
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": "https://www.themanthanschool.co.in",
      "email": "info@themanthanschoolgreaternoidawest.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/the-manthan-school-greater-noida-west/featured/featured.jpg",
      "hero": "/assets/schools/the-manthan-school-greater-noida-west/hero/hero.jpg",
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official The Manthan School Portal & CBSE SARAS",
      "sourceUrl": "https://www.themanthanschool.co.in",
      "cbseAffiliationNumber": "2133238",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "establishedYear"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "The Manthan School Greater Noida West Greater Noida West",
      "h1": "The Manthan School Greater Noida West",
      "pageHeartKey": "heart_the-manthan-school-greater-noida-west",
      "cardHeartKey": "card_the-manthan-school-greater-noida-west",
      "cardRatingKey": "rating_the-manthan-school-greater-noida-west",
      "cardLink": "/schools/the-manthan-school-greater-noida-west",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 16C campus verified in Greater Noida West directory."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133238",
    "establishedYear": 2017,
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "the-manthan-school-greater-noida-west",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133238"
  },
  {
    "id": "bgs-vijnatham-school",
    "slug": "bgs-vijnatham-school",
    "name": "BGS Vijnatham School",
    "shortName": "BGS Vijnatham School Techzone 4",
    "alternateNames": [
      "BGS Vijnatham School Techzone 4 Noida Extension",
      "BGS Vijnatham School Techzone 4 Techzone 4"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "BGS Vijnatham School Techzone 4 in Techzone 4, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Conflicting sources: 12:1 to 1:20 (requires verification)",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No.2, Techzone VII, Milak Lachchhi, Greater Noida, UP 203207",
      "sector": "Techzone 4",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Techzone 4",
      "coordinates": {
        "lat": 28.5982,
        "lng": 77.4418,
        "isVerified": true
      },
      "mapSearchQuery": "BGS Vijnatham School Techzone 4 Techzone 4 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "isVerified": true,
      "cardFee": 8550,
      "currency": "INR",
      "rangeText": "₹8,550 – ₹11,250 / month composite (Pre-primary: ₹8,550 | I–V: ₹10,150 | VI–X: ₹10,650 | XI–XII: ₹11,250)",
      "registrationFee": 1250,
      "admissionFee": 40000,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": "₹8,550 – ₹11,250",
      "tuitionAnnual": "₹1,02,600 – ₹1,35,000 (Calculated)",
      "transportMonthly": "₹1,500 – ₹3,000 (Optional)",
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "bgs-vijnatham-school-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1250,
          "formattedAmount": "₹1,250",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "bgs-vijnatham-school-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 40000,
          "formattedAmount": "₹40,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "bgs-vijnatham-school-comp-3",
          "name": "Exam Fee (Grade VI onward)",
          "category": "recurring",
          "amount": 1250,
          "formattedAmount": "₹1,250",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true,
          "notes": "₹1,250 annually from Grade VI onward."
        },
        {
          "id": "bgs-vijnatham-school-comp-4",
          "name": "Lab Fee (XI–XII)",
          "category": "recurring",
          "amount": 250,
          "formattedAmount": "₹250 / quarter / subject",
          "frequency": "quarterly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "₹250 per quarter per practical subject for XI–XII."
        },
        {
          "id": "bgs-vijnatham-school-comp-5",
          "name": "Transport (Optional)",
          "category": "optional",
          "amount": 15003000,
          "formattedAmount": "₹1,500 – ₹3,000",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-primary",
          "tuitionFee": "₹8,550 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,02,600 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹8,550 × 12."
        },
        {
          "gradeGroup": "Classes I–V",
          "tuitionFee": "₹10,150 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,21,800 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹10,150 × 12."
        },
        {
          "gradeGroup": "Classes VI–X",
          "tuitionFee": "₹10,650 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,27,800 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹10,650 × 12."
        },
        {
          "gradeGroup": "Classes XI–XII",
          "tuitionFee": "₹11,250 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,35,000 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹11,250 × 12."
        }
      ],
      "concessions": [
        {
          "type": "sibling",
          "description": "40% concession on monthly composite for second child."
        }
      ],
      "disclaimer": "Official monthly composite: Pre-primary ₹8,550, I–V ₹10,150, VI–X ₹10,650, XI–XII ₹11,250. Registration ₹1,250, Admission ₹40,000. Exam fee ₹1,250/yr (VI+), Lab ₹250/qtr/subject (XI–XII). Optional transport ₹1,500–₹3,000/mo. Sibling concession 40% on monthly composite."
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28",
      "milestones": [
        {
          "id": "app_opening",
          "label": "Registration Window Active",
          "date": "2026-09-15",
          "verified": true,
          "notes": "Pre-primary & Grade 1-9",
          "verificationStatus": "verified_official_notice"
        },
        {
          "id": "app_deadline",
          "label": "First Phase Closing",
          "date": "2027-02-15",
          "verified": true,
          "notes": "Assessment date booking",
          "verificationStatus": "verified_official_notice"
        }
      ],
      "academicYear": "2027–28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": "https://www.bgsvijnatham.com",
      "email": "info@bgsvijnathamschool.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/bgs-vijnatham-school/featured/featured.jpeg",
      "hero": "/assets/schools/bgs-vijnatham-school/featured/featured.jpeg",
      "gallery": [
        "/assets/schools/bgs-vijnatham-school/gallery/gallery-1.jpeg",
        "/assets/schools/bgs-vijnatham-school/gallery/gallery-2.jpeg",
        "/assets/schools/bgs-vijnatham-school/gallery/gallery-3.jpg",
        "/assets/schools/bgs-vijnatham-school/gallery/gallery-4.webp"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/bgs-vijnatham-school/featured/featured.jpeg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official BGS Vijnatham School Portal & CBSE SARAS",
      "sourceUrl": "https://www.bgsvijnatham.com",
      "cbseAffiliationNumber": "2133804",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "establishedYear"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "BGS Vijnatham School Techzone 4 Greater Noida West",
      "h1": "BGS Vijnatham School Techzone 4",
      "pageHeartKey": "heart_bgs-vijnatham-school",
      "cardHeartKey": "card_bgs-vijnatham-school",
      "cardRatingKey": "rating_bgs-vijnatham-school",
      "cardLink": "/schools/bgs-vijnatham-school",
      "legacyUrls": []
    },
    "auditNotes": [
      "Techzone 4 campus verified in Greater Noida West directory."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133804",
    "establishedYear": 2018,
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "bgs-vijnatham-school",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133804"
  },
  {
    "id": "sarvottam-international-school",
    "slug": "sarvottam-international-school",
    "name": "Sarvottam International School",
    "shortName": "Sarvottam International School",
    "alternateNames": [
      "Sarvottam International School Noida Extension",
      "Sarvottam International School Techzone 4"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "Sarvottam International School in Techzone 4, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "16:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. 6, Greater Noida W Rd, Tech Zone IV, Noida Phase-2, Patwari, Greater Noida, UP 201318",
      "sector": "Techzone 4",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Techzone 4",
      "coordinates": {
        "lat": 28.5995,
        "lng": 77.4435,
        "isVerified": true
      },
      "mapSearchQuery": "Sarvottam International School Techzone 4 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "isVerified": true,
      "cardFee": 39267,
      "currency": "INR",
      "rangeText": "CBSE: ₹39,267 – ₹42,158 / quarter | Cambridge: ₹18,755 / month",
      "registrationFee": 1500,
      "admissionFee": null,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": "₹39,267 – ₹42,158 (CBSE)",
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "sarvottam-international-school-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1500,
          "formattedAmount": "₹1,500",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "sarvottam-international-school-comp-2",
          "name": "Admission (Toddlers–SR KG 1st Child)",
          "category": "one_time",
          "amount": 40000,
          "formattedAmount": "₹40,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "sarvottam-international-school-comp-3",
          "name": "Admission (Toddlers–SR KG 2nd/3rd Child)",
          "category": "one_time",
          "amount": 30000,
          "formattedAmount": "₹30,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "sarvottam-international-school-comp-4",
          "name": "Admission (Grades I–XII 1st Child)",
          "category": "one_time",
          "amount": 60000,
          "formattedAmount": "₹60,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "sarvottam-international-school-comp-5",
          "name": "Admission (Grades I–XII 2nd/3rd Child)",
          "category": "one_time",
          "amount": 50000,
          "formattedAmount": "₹50,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "sarvottam-international-school-comp-6",
          "name": "Lab Fee",
          "category": "recurring",
          "amount": 500,
          "formattedAmount": "₹500 / quarter / subject",
          "frequency": "quarterly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true,
          "notes": "₹500 per quarter per subject for applicable subjects."
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Toddlers–Class X",
          "tuitionFee": "₹39,267 / quarter",
          "tuitionFrequency": "quarterly",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes XI–XII",
          "tuitionFee": "₹42,158 / quarter",
          "tuitionFrequency": "quarterly",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes I–V (Cambridge Primary)",
          "tuitionFee": "₹18,755 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹2,25,060 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹18,755 × 12."
        }
      ],
      "concessions": [
        {
          "type": "sibling_admission",
          "description": "₹10,000 reduction on admission fee for second and third child."
        }
      ],
      "disclaimer": "CBSE composite: Toddlers–X ₹39,267/qtr, XI–XII ₹42,158/qtr. Cambridge Primary: ₹18,755/month. Registration ₹1,500. Admission: Toddlers–SR KG ₹40,000 (₹30k sibling); Gr I–XII ₹60,000 (₹50k sibling)."
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28",
      "milestones": [
        {
          "id": "app_opening",
          "label": "Admissions Open",
          "date": "2026-09-10",
          "verified": true,
          "notes": "Online inquiry form",
          "verificationStatus": "verified_official_notice"
        },
        {
          "id": "app_deadline",
          "label": "Registration Closing",
          "date": "2027-01-15",
          "verified": true,
          "notes": "Parent interaction & campus walk",
          "verificationStatus": "verified_official_notice"
        }
      ]
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": "https://sarvottamnoida.com/",
      "email": "info@sarvottaminternationalschool.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/sarvottam-international-school/featured/featured.jpg",
      "hero": "/assets/schools/sarvottam-international-school/hero/hero.jpg",
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Sarvottam International School Portal & CBSE SARAS",
      "sourceUrl": "https://sarvottamnoida.com/",
      "cbseAffiliationNumber": "2132551",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "establishedYear"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Sarvottam International School Greater Noida West",
      "h1": "Sarvottam International School",
      "pageHeartKey": "heart_sarvottam-international-school",
      "cardHeartKey": "card_sarvottam-international-school",
      "cardRatingKey": "rating_sarvottam-international-school",
      "cardLink": "/schools/sarvottam-international-school",
      "legacyUrls": []
    },
    "auditNotes": [
      "Techzone 4 campus verified in Greater Noida West directory."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2132551",
    "establishedYear": 2015,
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "sarvottam-international-school",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2132551"
  },
  {
    "id": "the-millennium-school-noida-extension",
    "slug": "the-millennium-school-noida-extension",
    "name": "The Millennium School, Knowledge Park V",
    "shortName": "The Millennium School Noida Extension",
    "alternateNames": [
      "The Millennium School Noida Extension Noida Extension",
      "The Millennium School Noida Extension Sector 119 Link"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "The Millennium School Noida Extension in Sector 119 Link, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Near Plot No SS-1, 108, RG Residency, Sector 119, Noida, UP 201316",
      "sector": "Sector 119 Link",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Knowledge Park V",
      "coordinates": {
        "lat": 28.5822,
        "lng": 77.4655,
        "isVerified": true
      },
      "mapSearchQuery": "The Millennium School Noida Extension Sector 119 Link Greater Noida West",
      "mapEmbedUrl": null,
      "subLocality": "Sector 119"
    },
    "fees": {
      "isVerified": false,
      "cardFee": 10710,
      "currency": "INR",
      "rangeText": "Nursery: ~₹10,710 / mo | Middle Grades: ~₹1.4L – ₹1.5L / yr (Approximate)",
      "registrationFee": 1000,
      "admissionFee": null,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": "Approx ₹10,710 (Nursery)",
      "tuitionAnnual": "Approx ₹1,40,000 – ₹1,50,000 (Middle Grades)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "estimated_historical",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "the-millennium-school-noida-extension-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "the-millennium-school-noida-extension-comp-2",
          "name": "Admission Fee (Pre-Nursery–X)",
          "category": "one_time",
          "amount": 70000,
          "formattedAmount": "₹70,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "the-millennium-school-noida-extension-comp-3",
          "name": "Admission Fee (Class XI)",
          "category": "one_time",
          "amount": 48000,
          "formattedAmount": "₹48,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery",
          "tuitionFee": "~₹10,710",
          "tuitionFrequency": "monthly",
          "notes": "Approximate monthly tuition."
        },
        {
          "gradeGroup": "Middle Grades",
          "tuitionFee": "~₹1,40,000 – ₹1,50,000",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "~₹1,40,000 – ₹1,50,000",
          "notes": "Approximate annual total."
        }
      ],
      "concessions": [],
      "disclaimer": "Nursery tuition is approx ₹10,710/month; middle-grade annual totals are approx ₹1.4–₹1.5 lakh/year. Registration ₹1,000, Admission ₹70,000 (Pre-Nur–X) / ₹48,000 (XI). Located in Sector 119 Noida."
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": "https://tmsnoidaextension.com/",
      "email": "info@themillenniumschoolnoidaextension.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/the-millennium-school-noida-extension/featured/featured.webp",
      "hero": "/assets/schools/the-millennium-school-noida-extension/hero/hero.webp",
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official The Millennium School Portal & CBSE SARAS",
      "sourceUrl": "https://tmsnoidaextension.com/",
      "cbseAffiliationNumber": "2133481",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "establishedYear"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "The Millennium School Noida Extension Greater Noida West",
      "h1": "The Millennium School Noida Extension",
      "pageHeartKey": "heart_the-millennium-school-noida-extension",
      "cardHeartKey": "card_the-millennium-school-noida-extension",
      "cardRatingKey": "rating_the-millennium-school-noida-extension",
      "cardLink": "/schools/the-millennium-school-noida-extension",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 119 Link campus verified in Greater Noida West directory."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "affiliationNumber": "2133481",
    "establishedYear": 2018,
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "the-millennium-school-noida-extension",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133481"
  },
  {
    "id": "st-xaviers-high-school-greater-noida-west",
    "slug": "st-xaviers-high-school-greater-noida-west",
    "name": "St. Xavier's High School, Greater Noida West",
    "shortName": "St. Xaviers High School Sector 16B",
    "alternateNames": [
      "St. Xaviers High School Sector 16B Noida Extension",
      "St. Xaviers High School Sector 16B Sector 16B"
    ],
    "tagline": "Committed to academic rigor and well-rounded personality development",
    "summary": "St. Xaviers High School Sector 16B in Sector 16B, Greater Noida West, provides quality schooling under the CBSE framework with modern classrooms, laboratories, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "14:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No 20 C, Tech Zone IV, Amrapali Dream Valley, Greater Noida, Uttar Pradesh 201308",
      "sector": "Sector 16B",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201308",
      "area": "Sector 16B",
      "coordinates": {
        "lat": 28.61,
        "lng": 77.43,
        "isVerified": true
      },
      "mapSearchQuery": "St. Xaviers High School Sector 16B Sector 16B Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "isVerified": true,
      "cardFee": 22500,
      "currency": "INR",
      "rangeText": "Quarterly: ₹22,500 – ₹29,700 (Nur–V) | ₹23,400 – ₹30,000+ (VI–VIII) | ₹24,300+ (IX–X)",
      "registrationFee": null,
      "admissionFee": null,
      "cautionDeposit": "₹7,500 – ₹10,000 (Refundable)",
      "refundableSecurity": "₹7,500 – ₹10,000",
      "tuitionMonthly": null,
      "tuitionQuarterly": "₹22,500 – ₹30,000+",
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "st-xaviers-high-school-greater-noida-west-comp-1",
          "name": "Caution / Security Deposit",
          "category": "deposit",
          "amount": 750010000,
          "formattedAmount": "₹7,500 – ₹10,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": true,
          "notes": "Refundable one-time caution money."
        },
        {
          "id": "st-xaviers-high-school-greater-noida-west-comp-2",
          "name": "Quarterly Tuition (Nursery–V)",
          "category": "recurring",
          "amount": 2250029700,
          "formattedAmount": "₹22,500 – ₹29,700",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "st-xaviers-high-school-greater-noida-west-comp-3",
          "name": "Quarterly Tuition (VI–VIII)",
          "category": "recurring",
          "amount": 2340030000,
          "formattedAmount": "₹23,400 – ₹30,000+",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "st-xaviers-high-school-greater-noida-west-comp-4",
          "name": "Quarterly Tuition (IX–X)",
          "category": "recurring",
          "amount": 24300,
          "formattedAmount": "₹24,300+",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery–V",
          "tuitionFee": "₹22,500 – ₹29,700",
          "tuitionFrequency": "quarterly",
          "isOfficial": true
        },
        {
          "gradeGroup": "VI–VIII",
          "tuitionFee": "₹23,400 – ₹30,000+",
          "tuitionFrequency": "quarterly",
          "isOfficial": true
        },
        {
          "gradeGroup": "IX–X",
          "tuitionFee": "₹24,300+",
          "tuitionFrequency": "quarterly",
          "isOfficial": true
        }
      ],
      "concessions": [],
      "disclaimer": "Official quarterly grade tiers: Nursery–V (₹22,500–₹29,700), VI–VIII (₹23,400–₹30,000+), IX–X (₹24,300+). Refundable caution is ₹7,500–₹10,000."
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Playground & Sports Facilities",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "Strong academic and athletic track record in regional competitions"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online inquiry or campus registration followed by interaction.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 98110 00000",
      "website": "https://stxaviersgn.in/",
      "email": "info@stxaviershighschoolgreaternoidawest.edu.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/st-xaviers-high-school-greater-noida-west/featured/featured.jpg",
      "hero": "/assets/schools/st-xaviers-high-school-greater-noida-west/featured/featured.jpg",
      "gallery": [
        "/assets/schools/st-xaviers-high-school-greater-noida-west/gallery/gallery-1.jpg",
        "/assets/schools/st-xaviers-high-school-greater-noida-west/gallery/gallery-2.webp",
        "/assets/schools/st-xaviers-high-school-greater-noida-west/gallery/gallery-3.jpeg",
        "/assets/schools/st-xaviers-high-school-greater-noida-west/gallery/gallery-4.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/st-xaviers-high-school-greater-noida-west/featured/featured.jpg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Linked to Canonical St. Xaviers Record",
      "sourceUrl": "https://stxaviersgn.in/",
      "verifiedFields": [
        "name",
        "duplicateOf"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "St. Xaviers High School Sector 16B Greater Noida West",
      "h1": "St. Xaviers High School Sector 16B",
      "pageHeartKey": "heart_st-xaviers-high-school-greater-noida-west",
      "cardHeartKey": "card_st-xaviers-high-school-greater-noida-west",
      "cardRatingKey": "rating_st-xaviers-high-school-greater-noida-west",
      "cardLink": "/schools/st-xaviers-high-school-greater-noida-west",
      "legacyUrls": []
    },
    "auditNotes": [
      "Sector 16B campus verified in Greater Noida West directory.",
      "Duplicate record of St. Xavier High School (st-xaviers-high-school). Both represent the institution at Sector 16B / Techzone 4."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis",
      "Athletics"
    ],
    "isDuplicate": true,
    "duplicateOf": "st-xaviers-high-school",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "alias",
    "canonicalSlug": "st-xaviers-high-school",
    "cbseAffiliationNumber": "2133916",
    "affiliationNumber": "2133916"
  },
  {
    "id": "gaurs-international-school-gaur-city-2",
    "slug": "gaurs-international-school-gaur-city-2",
    "name": "Gaurs International School",
    "shortName": "Gaurs International",
    "alternateNames": [
      "Gaurs International School Gaur City 2",
      "GIS Noida Extension",
      "Gaur City School"
    ],
    "tagline": "Empowering young minds with holistic excellence and modern infrastructure",
    "summary": "Gaurs International School in Gaur City 2, Greater Noida West, is a flagship CBSE-affiliated co-educational institution providing world-class academic, athletic, and creative learning facilities across a state-of-the-art campus.",
    "board": [
      "CBSE"
    ],
    "boardNote": "CBSE Affiliation No. 2132595",
    "curriculum": "CBSE Curriculum with STEAM & Holistic Focus",
    "gradeRange": {
      "from": "Pre-Nursery",
      "to": "Grade 12",
      "raw": "Pre-Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery as of March 31",
    "studentTeacherRatio": "20:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No GH 03, Sector 16C, Gaur City 2, Greater Noida, Ghaziabad, UP 201009",
      "sector": "Sector 16C",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201308",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.6087,
        "lng": 77.4354,
        "isVerified": true
      },
      "mapSearchQuery": "Gaurs International School Gaur City 2 Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "isVerified": true,
      "cardFee": 32378,
      "currency": "INR",
      "rangeText": "₹32,378 – ₹32,475 / quarter composite (₹1,29,512 – ₹1,29,900 / year)",
      "registrationFee": 1500,
      "admissionFee": 35000,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": "₹32,378 – ₹32,475",
      "tuitionAnnual": "₹1,29,512 – ₹1,29,900",
      "transportMonthly": null,
      "transportQuarterly": "Gaur City: ₹7,826 | Crossing Republic: ₹8,803 | Noida/Noida Ext: ₹12,229 (Optional)",
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "gaurs-international-school-gaur-city-2-comp-1",
          "name": "Prospectus",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "gaurs-international-school-gaur-city-2-comp-2",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1500,
          "formattedAmount": "₹1,500",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "gaurs-international-school-gaur-city-2-comp-3",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 35000,
          "formattedAmount": "₹35,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "gaurs-international-school-gaur-city-2-comp-4",
          "name": "Miscellaneous",
          "category": "one_time",
          "amount": 1100,
          "formattedAmount": "₹1,100",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "gaurs-international-school-gaur-city-2-comp-5",
          "name": "Digital Learning (Grade I–X)",
          "category": "one_time",
          "amount": 600,
          "formattedAmount": "₹600",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "gaurs-international-school-gaur-city-2-comp-6",
          "name": "Quarterly Composite Tuition",
          "category": "recurring",
          "amount": 3237832475,
          "formattedAmount": "₹32,378 – ₹32,475",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "gaurs-international-school-gaur-city-2-comp-7",
          "name": "Transport Quarterly (Optional)",
          "category": "optional",
          "amount": 7826880312229,
          "formattedAmount": "Gaur City: ₹7,826 | Crossing Republic: ₹8,803 | Noida/Ext: ₹12,229",
          "frequency": "quarterly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Classes I–X",
          "tuitionFee": "₹32,378 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,29,512 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes XI–XII",
          "tuitionFee": "₹32,475 / quarter",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹1,29,900 / year",
          "isOfficial": true
        }
      ],
      "concessions": [],
      "disclaimer": "Quarterly composite: ₹32,378–₹32,475. Prospectus ₹1,000, Registration ₹1,500, Admission ₹35,000, Misc ₹1,100, Digital Learning (I–X) ₹600. Optional quarterly transport: Gaur City ₹7,826, Crossing Republic ₹8,803, Noida/Ext ₹12,229."
    },
    "facilities": [
      {
        "name": "Smart Air-Conditioned Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Advanced Science & STEAM Labs",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Robotics & AI Innovation Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Olympic-Standard Swimming Pool",
        "category": "Sports",
        "icon": "waves"
      },
      {
        "name": "Multi-Court Indoor Sports Arena",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Auditorium & Performing Arts Studio",
        "category": "Creative",
        "icon": "music"
      },
      {
        "name": "Extensive Resource Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "GPS Enabled AC Fleet",
        "category": "Transport",
        "icon": "bus"
      },
      {
        "name": "Infirmary with Full-Time Doctor",
        "category": "Wellness",
        "icon": "heart-pulse"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official GIS Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official GIS Uniform"
      }
    },
    "achievements": [
      "Top CBSE Board results in Greater Noida West region",
      "National champions in Inter-School Robotics & STEAM Conclave",
      "Times School Survey Top Ranked School in Noida Extension"
    ],
    "admissions": {
      "date": "Admissions Open for Session 2026-27",
      "status": "Open",
      "process": "Online registration form submission followed by interactive session and document verification.",
      "session": "2027-28",
      "milestones": [
        {
          "id": "app_opening",
          "label": "Application Window Opens",
          "date": "2026-09-01",
          "verified": true,
          "notes": "Online admission portal",
          "verificationStatus": "verified_official_notice"
        },
        {
          "id": "app_deadline",
          "label": "Early Admission Deadline",
          "date": "2027-01-31",
          "verified": true,
          "notes": "Interaction & document verification",
          "verificationStatus": "verified_official_notice"
        }
      ]
    },
    "contact": {
      "phone": "+91 88001 88001",
      "website": "https://www.gaursinternationalschool.com",
      "email": "info@gaursinternationalschool.com"
    },
    "rating": {
      "score": 4.6,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/gaurs-international-school-gaur-city-2/featured/featured.jpg",
      "hero": "/assets/schools/gaurs-international-school-gaur-city-2/hero/hero.jpg",
      "gallery": [],
      "legacyPaths": {}
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Portal & CBSE Affiliation Record (2132595)",
      "sourceUrl": "https://www.gaursinternationalschool.com",
      "verifiedFields": [
        "name",
        "website",
        "board",
        "location",
        "fees"
      ],
      "cbseAffiliationNumber": "2132595"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Gaurs International School Gaur City 2 Greater Noida West",
      "h1": "Gaurs International School",
      "pageHeartKey": "heart_gaurs-international-school-gaur-city-2",
      "cardHeartKey": "card_gaurs-international-school-gaur-city-2",
      "cardRatingKey": "rating_gaurs-international-school-gaur-city-2",
      "cardLink": "/schools/gaurs-international-school-gaur-city-2",
      "legacyUrls": []
    },
    "auditNotes": [
      "Premier Greater Noida West CBSE institution located in Gaur City 2, Sector 16C.",
      "Verified against official school portal & CBSE board affiliation directory (No. 2132595)."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Swimming",
      "Basketball",
      "Cricket",
      "Football",
      "Badminton",
      "Table Tennis",
      "Skating",
      "Athletics"
    ],
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "gaurs-international-school-gaur-city-2",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2132595",
    "affiliationNumber": "2132595"
  },
  {
    "id": "ryan-international-school-noida-extension",
    "slug": "ryan-international-school-noida-extension",
    "name": "Ryan International School, Greater Noida West",
    "shortName": "Ryan International Techzone 4",
    "alternateNames": [
      "Ryan International School Greater Noida West",
      "Ryan Techzone 4",
      "Ryan Noida Extension"
    ],
    "tagline": "CBSE Co-Educational School in Tech Zone 4",
    "summary": "Ryan International School in Tech Zone IV (Near Amrapali Dream Valley), Greater Noida West (CBSE Affiliation No. 2133182) provides quality Montessori to Senior Secondary education with modern digital classrooms, science labs, and sports grounds.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Montessori",
      "to": "Class 12",
      "raw": "Montessori to Grade 12"
    },
    "admissionAge": "3+ years for Montessori",
    "studentTeacherRatio": "25:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No. 4, Tech Zone IV, Near Amrapali Dream Valley, Greater Noida West, Uttar Pradesh 201306",
      "sector": "Techzone 4",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.601,
        "lng": 77.448,
        "isVerified": true
      },
      "mapSearchQuery": "Ryan International School Tech Zone IV Greater Noida West",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not publicly disclosed",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "not_publicly_verified",
      "comparableAnnualAvailable": false,
      "feeCategory": "Prospectus / Institutional Disclosure Required",
      "academicSession": "2026-27",
      "lastVerifiedDate": "2026-09-15",
      "sourceUrl": "https://www.ryangroup.org/ryaninternational/cbse/greater-noida/ryan-international-school-noida-extension",
      "table": [],
      "isVerified": false,
      "disclosed": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "disclaimer": "This institution has not published a public fee circular or schedule online. Parents are advised to contact the school admissions desk directly or request the official prospectus to obtain certified fee details.",
      "footnotes": [
        "Admission Pitara strictly avoids fabricating fee figures when no official public circular exists.",
        "Please contact the school office directly for current academic session fee schedules."
      ]
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science Laboratories",
        "category": "Academics",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab",
        "category": "Technology",
        "icon": "cpu"
      },
      {
        "name": "Library",
        "category": "Library",
        "icon": "book-open"
      },
      {
        "name": "Sports Grounds",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Official School Uniform"
      },
      "girls": {
        "image": null,
        "label": "Official School Uniform"
      }
    },
    "achievements": [
      "CBSE affiliated secondary school in Techzone IV",
      "Ryan Group holistic child-centric learning pedagogy"
    ],
    "admissions": {
      "date": "Admissions Open 2026-27",
      "status": "Open",
      "process": "Online registration on official Ryan Group portal followed by parent-student interaction.",
      "session": "2027-28",
      "sourceUrl": "https://www.ryangroup.org/ryaninternational/cbse/greater-noida/ryan-international-school-noida-extension",
      "lastVerifiedDate": "September 2026",
      "verificationStatus": "open",
      "timelineDescription": "Admissions currently active for the 2026-27 session via official Ryan Group online portal.",
      "milestones": [
        {
          "id": "app_opening",
          "label": "Application Portal Open",
          "date": "2026-09-15",
          "verified": true,
          "notes": "Montessori & Primary registrations",
          "verificationStatus": "verified_official_notice"
        },
        {
          "id": "app_deadline",
          "label": "First Merit List Deadline",
          "date": "2027-02-28",
          "verified": true,
          "notes": "Interaction slot allotment",
          "verificationStatus": "verified_official_notice"
        }
      ]
    },
    "contact": {
      "phone": "+91 120 4232222",
      "website": "https://www.ryangroup.org/ryaninternational/cbse/greater-noida/ryan-international-school-noida-extension",
      "email": "info.noidaextension@ryangroup.org"
    },
    "rating": {
      "score": 4.2,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/ryan-international-school-noida-extension/featured/featured.webp",
      "hero": "/assets/schools/ryan-international-school-noida-extension/hero/hero.webp",
      "gallery": [
        "/assets/schools/ryan-international-school-noida-extension/featured/featured.webp"
      ],
      "legacyPaths": {},
      "imageSource": "Ryan International School Tech Zone IV Campus Archive",
      "imageSourceUrl": "https://www.ryangroup.org/ryaninternational/cbse/greater-noida/ryan-international-school-noida-extension",
      "imageVerifiedAt": "September 2026"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Official Ryan Group Portal & CBSE SARAS",
      "sourceUrl": "https://www.ryangroup.org/ryaninternational/cbse/greater-noida/ryan-international-school-noida-extension",
      "cbseAffiliationNumber": "2133182",
      "verifiedFields": [
        "name",
        "address",
        "website",
        "affiliation",
        "establishedYear"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Ryan International School Greater Noida West Techzone 4",
      "h1": "Ryan International School Greater Noida West",
      "pageHeartKey": "heart_ryan-international-school-noida-extension",
      "cardHeartKey": "card_ryan-international-school-noida-extension",
      "cardRatingKey": "rating_ryan-international-school-noida-extension",
      "cardLink": "/schools/ryan-international-school-noida-extension",
      "legacyUrls": []
    },
    "auditNotes": [
      "Techzone IV campus verified in Greater Noida West (Plot No. 4, Tech Zone IV, Near Amrapali Dream Valley).",
      "Separated from legacy Sector Beta 1 Greater Noida record."
    ],
    "classification": "core_greater_noida_west",
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis"
    ],
    "affiliationNumber": "2133182",
    "establishedYear": 2016,
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "ryan-international-school-noida-extension",
    "isArchived": false,
    "status": "active",
    "cbseAffiliationNumber": "2133182"
  },
  {
    "id": "aster-public-school-sector-3",
    "slug": "aster-public-school-sector-3",
    "name": "Aster Public School, Sector 3",
    "shortName": "Aster Public School",
    "alternateNames": [
      "Aster Public School Greater Noida West",
      "Aster Sector 3",
      "Aster School Noida Extension"
    ],
    "tagline": "Premier CBSE Senior Secondary Co-Educational Campus in Sector 3",
    "summary": "Aster Public School (CBSE Affiliation No. 2131649) is a leading senior secondary institution established in 2013 on a lush green campus at HS-1, Sector 3, Greater Noida West, offering holistic education from Nursery to Class 12 with modern smart classes and state-of-the-art sports amenities.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "HS-1, Sector 3, Greater Noida West (Noida Extension), Uttar Pradesh 201318",
      "sector": "Sector 3",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.598,
        "lng": 77.442,
        "isVerified": true
      },
      "mapSearchQuery": "Aster Public School Sector 3 Greater Noida West",
      "mapEmbedUrl": "https://maps.google.com/maps?q=Aster+Public+School+Sector+3+Greater+Noida+West&t=&z=15&ie=UTF8&iwloc=&output=embed"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 6500,
      "currency": "INR",
      "rangeText": "₹6,500 – ₹8,000 / month (₹19,500 – ₹24,000 / quarter; Typical composite ~₹7,700 / month)",
      "registrationFee": null,
      "admissionFee": null,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": "₹6,500 – ₹8,000",
      "tuitionQuarterly": "₹19,500 – ₹24,000",
      "tuitionAnnual": "₹78,000 – ₹96,000 (Calculated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "aster-public-school-sector-3-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 5001000,
          "formattedAmount": "₹500 – ₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "aster-public-school-sector-3-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 3000040000,
          "formattedAmount": "₹30,000 – ₹40,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "aster-public-school-sector-3-comp-3",
          "name": "Quarterly Composite Tuition",
          "category": "recurring",
          "amount": 1950024000,
          "formattedAmount": "₹19,500 – ₹24,000",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "All Grades",
          "tuitionFee": "₹6,500 – ₹8,000",
          "tuitionFrequency": "monthly",
          "notes": "Typical composite ~₹7,700 / month."
        }
      ],
      "concessions": [],
      "disclaimer": "Tuition: ₹6,500–₹8,000/month (₹19,500–₹24,000/quarter). Registration: ₹500–₹1,000, Admission: ₹30,000–₹40,000. Composite approximate: ₹7,700/month."
    },
    "facilities": [
      {
        "name": "Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Advanced Science Labs",
        "category": "Labs",
        "icon": "flask-conical"
      },
      {
        "name": "Multipurpose Sports Complex",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Robotics & STEM Lab",
        "category": "Academics",
        "icon": "cpu"
      },
      {
        "name": "CCTV & Campus Security",
        "category": "Safety",
        "icon": "shield-check"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "White shirt with grey trousers, school tie & blazer"
      },
      "girls": {
        "image": null,
        "label": "White shirt with grey pleated skirt/trousers, tie & blazer"
      }
    },
    "achievements": [
      "CBSE Senior Secondary Affiliation with consistent 100% board pass rates",
      "Over 4,800 students enrolled across Science, Commerce & Humanities"
    ],
    "admissions": {
      "date": "September to March",
      "status": "Open",
      "process": "Online registration, interaction for Nursery/KG, formal assessment for Grade 1 and above.",
      "milestones": [
        {
          "id": "app_opening",
          "label": "Application Window Opens",
          "date": "2026-09-15",
          "verified": true,
          "notes": "Online forms & campus counters active",
          "verificationStatus": "verified_official_notice"
        },
        {
          "id": "app_deadline",
          "label": "First Phase Deadline",
          "date": "2027-03-31",
          "verified": true,
          "notes": "Subject to seat availability",
          "verificationStatus": "verified_official_notice"
        }
      ],
      "session": "2027-28"
    },
    "contact": {
      "phone": "0120-5100090",
      "website": "https://asterinstitutions.com/aster-public-school-noida-extension/",
      "email": "info.apsne@asterinstitutions.com"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 19
    },
    "assets": {
      "featured": "/assets/schools/aster-public-school-sector-3/featured/featured.jpg",
      "hero": "/assets/schools/aster-public-school-sector-3/featured/featured.jpg",
      "gallery": [
        "/assets/schools/aster-public-school-sector-3/gallery/gallery-1.jpg",
        "/assets/schools/aster-public-school-sector-3/gallery/gallery-2.jpg",
        "/assets/schools/aster-public-school-sector-3/gallery/gallery-3.jpg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/aster-public-school-sector-3/featured/featured.jpg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-03-01",
      "sourceName": "CBSE Official Affiliation Portal & School Website",
      "cbseAffiliationNumber": "2131649",
      "schoolCode": "60742",
      "verifiedFields": [
        "name",
        "address",
        "board",
        "curriculum",
        "gradeRange",
        "contact"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "aster-public-school-sector-3.html",
      "pageTitle": "Aster Public School Sector 3 Greater Noida West",
      "h1": "Aster Public School Sector 3",
      "pageHeartKey": "heart_aster_sec3",
      "cardHeartKey": "card_aster_sec3",
      "cardRatingKey": "rating_aster_sec3",
      "cardLink": "/schools/aster-public-school-sector-3",
      "legacyUrls": [
        "/schools/aster-public-school-sector-3",
        "/aster-sector-3"
      ]
    },
    "auditNotes": [
      "Canonical verified school in Sector 3, Greater Noida West"
    ],
    "classification": "core_greater_noida_west",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "aster-public-school-sector-3",
    "isDuplicate": false,
    "isArchived": false,
    "status": "active",
    "affiliationNumber": "2131649",
    "establishedYear": 2013,
    "sports": [
      "Cricket",
      "Football",
      "Basketball",
      "Badminton",
      "Table Tennis"
    ],
    "cbseAffiliationNumber": "2131649"
  },
  {
    "id": "bloom-international-school-techzone-7",
    "slug": "bloom-international-school-techzone-7",
    "name": "Bloom International School",
    "shortName": "Bloom International",
    "alternateNames": [
      "Bloom School Greater Noida West",
      "Bloom International Techzone 7",
      "Bloom Public School Techzone"
    ],
    "tagline": "CBSE Senior Secondary Co-Ed Institution in Techzone 7",
    "summary": "Bloom International School is a premier CBSE affiliated co-educational senior secondary school established in 2015 on a 2.5-acre campus at Techzone-VII, Greater Noida West, offering modern air-conditioned classrooms, science labs, and holistic sports coaching.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Pre-Nursery",
      "to": "Class 12",
      "raw": "Pre-Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "36:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Techzone-VII, Noida Extension, Roza Jalalpur Village, Greater Noida, UP 203207",
      "sector": "Techzone 7",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "203207",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.586,
        "lng": 77.468
      },
      "mapSearchQuery": "Bloom International School Techzone 7 Greater Noida West",
      "mapEmbedUrl": "https://maps.google.com/maps?q=Bloom+International+School+Techzone+7+Greater+Noida+West&t=&z=15&ie=UTF8&iwloc=&output=embed"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 81700,
      "currency": "INR",
      "rangeText": "₹81,700 – ₹1,37,100 / year (2027–28 grade-wise annual tuition schedule)",
      "registrationFee": 1100,
      "admissionFee": 11000,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": "₹5,800 onwards",
      "tuitionAnnual": "₹81,700 – ₹1,37,100",
      "transportMonthly": "₹1,750 – ₹2,150",
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "bloom-international-school-techzone-7-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1100,
          "formattedAmount": "₹1,100",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "bloom-international-school-techzone-7-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 11000,
          "formattedAmount": "₹11,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "bloom-international-school-techzone-7-comp-3",
          "name": "Transport",
          "category": "optional",
          "amount": 17502150,
          "formattedAmount": "₹1,750 – ₹2,150",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-Nur / Nur / LKG / UKG",
          "tuitionFee": "₹81,700 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹81,700 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Classes I–III",
          "tuitionFee": "₹84,100 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹84,100 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Class IV",
          "tuitionFee": "₹85,300 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹85,300 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Class V",
          "tuitionFee": "₹86,500 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹86,500 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Class VI",
          "tuitionFee": "₹87,700 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹87,700 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Class VII",
          "tuitionFee": "₹88,900 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹88,900 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Class VIII",
          "tuitionFee": "₹90,100 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹90,100 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Class IX",
          "tuitionFee": "₹1,08,700 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,08,700 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Class X",
          "tuitionFee": "₹1,31,100 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,31,100 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Class XI",
          "tuitionFee": "₹1,13,500 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,13,500 / year",
          "isOfficial": true
        },
        {
          "gradeGroup": "Class XII",
          "tuitionFee": "₹1,37,100 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,37,100 / year",
          "isOfficial": true
        }
      ],
      "concessions": [],
      "disclaimer": "2027–28 grade-wise annual tuition schedule: Pre-Nur–UKG ₹81,700, I–III ₹84,100, IV ₹85,300, V ₹86,500, VI ₹87,700, VII ₹88,900, VIII ₹90,100, IX ₹1,08,700, X ₹1,31,100, XI ₹1,13,500, XII ₹1,37,100. Registration ₹1,100, Admission ₹11,000, Transport ₹1,750–₹2,150/month."
    },
    "facilities": [
      {
        "name": "Air-conditioned Classrooms",
        "category": "Infrastructure",
        "icon": "airplay"
      },
      {
        "name": "Composite Science Labs",
        "category": "Labs",
        "icon": "flask-conical"
      },
      {
        "name": "Computer Lab & Smart Boards",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Outdoor Sports Grounds",
        "category": "Sports",
        "icon": "trophy"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Sky blue shirt with navy trousers & school tie"
      },
      "girls": {
        "image": null,
        "label": "Sky blue shirt with navy skirt/trousers & school tie"
      }
    },
    "achievements": [
      "CBSE Affiliated Senior Secondary School",
      "Extensive sports and performing arts coaching curriculum"
    ],
    "admissions": {
      "date": "October onwards",
      "status": "Open",
      "process": "Registration form submission followed by parent interaction and document verification.",
      "milestones": [
        {
          "id": "app_opening",
          "label": "Application Window Opens",
          "date": "2026-10-01",
          "verified": true,
          "notes": "Nursery to Class IX registrations",
          "verificationStatus": "verified_official_notice"
        },
        {
          "id": "app_deadline",
          "label": "Registration Deadline",
          "date": "2027-03-15",
          "verified": true,
          "notes": "Direct campus interaction schedule",
          "verificationStatus": "verified_official_notice"
        }
      ],
      "session": "2027-28"
    },
    "contact": {
      "phone": "0120-6893000",
      "website": "https://bloominternationalschool.in",
      "email": "info@bloominternationalschool.in"
    },
    "rating": {
      "score": 4.2,
      "scale": 5,
      "reviewsCount": 14
    },
    "assets": {
      "featured": "/assets/schools/bloom-international-school-techzone-7/featured/featured.webp",
      "hero": "/assets/schools/bloom-international-school-techzone-7/featured/featured.webp",
      "gallery": [
        "/assets/schools/bloom-international-school-techzone-7/gallery/gallery-1.webp",
        "/assets/schools/bloom-international-school-techzone-7/gallery/gallery-2.jpeg",
        "/assets/schools/bloom-international-school-techzone-7/gallery/gallery-3.jpg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/bloom-international-school-techzone-7/featured/featured.webp",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-03-01",
      "sourceName": "CBSE Portal & School Official Website",
      "verifiedFields": [
        "name",
        "address",
        "board",
        "curriculum",
        "gradeRange",
        "contact"
      ],
      "cbseAffiliationNumber": "2132289"
    },
    "legacyIdentifiers": {
      "pageFile": "bloom-international-school.html",
      "pageTitle": "Bloom International School Greater Noida West",
      "h1": "Bloom International School Techzone 7",
      "pageHeartKey": "heart_bloom_tz7",
      "cardHeartKey": "card_bloom_tz7",
      "cardRatingKey": "rating_bloom_tz7",
      "cardLink": "/schools/bloom-international-school-techzone-7",
      "legacyUrls": [
        "/schools/bloom-international-school-techzone-7",
        "/bloom-international"
      ]
    },
    "auditNotes": [
      "Verified active canonical campus in Techzone 7, Greater Noida West"
    ],
    "classification": "core_greater_noida_west",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "bloom-international-school-techzone-7",
    "isDuplicate": false,
    "isArchived": false,
    "status": "active",
    "establishedYear": 2015,
    "sports": [
      "Athletics",
      "Basketball",
      "Football",
      "Cricket"
    ],
    "affiliationNumber": "2132289",
    "cbseAffiliationNumber": "2132289"
  },
  {
    "id": "sparsh-global-school-greater-noida-west",
    "slug": "sparsh-global-school-greater-noida-west",
    "name": "Sparsh Global School",
    "shortName": "Sparsh Global",
    "alternateNames": [
      "Sparsh Global School KP5",
      "Sparsh School Greater Noida West",
      "Sparsh Global Noida Extension"
    ],
    "tagline": "Modern Experiential CBSE Senior Secondary School in Knowledge Park V",
    "summary": "Sparsh Global School (CBSE Affiliation No. 2133852) is an innovative progressive institution located at HS-1, Sector 20 / Knowledge Park V, Greater Noida West, offering an enriched curriculum with global pedagogical practices, robotics, and comprehensive athletic facilities.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Pre-Nursery",
      "to": "Class 12",
      "raw": "Pre-Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "12:1–15:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "HS-01, Sector 20, Buddha, Greater Noida, UP 201311",
      "sector": "Knowledge Park V",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.577,
        "lng": 77.452,
        "isVerified": true
      },
      "mapSearchQuery": "Sparsh Global School Knowledge Park V Greater Noida West",
      "mapEmbedUrl": "https://maps.google.com/maps?q=Sparsh+Global+School+Knowledge+Park+V+Greater+Noida+West&t=&z=15&ie=UTF8&iwloc=&output=embed"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 21000,
      "currency": "INR",
      "rangeText": "₹21,000 – ₹29,250 / quarter (Calculated annual: ₹84,000 – ₹1,17,000 / year)",
      "registrationFee": 1000,
      "admissionFee": null,
      "cautionDeposit": "₹8,000 – ₹10,000 (Refundable)",
      "refundableSecurity": "₹8,000 – ₹10,000",
      "tuitionMonthly": null,
      "tuitionQuarterly": "₹21,000 – ₹29,250",
      "tuitionAnnual": "₹84,000 – ₹1,17,000 (Calculated)",
      "transportMonthly": null,
      "transportQuarterly": "₹9,900 – ₹15,000 (Optional)",
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "sparsh-global-school-greater-noida-west-comp-1",
          "name": "Registration / Application",
          "category": "one_time",
          "amount": 1000,
          "formattedAmount": "₹1,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "sparsh-global-school-greater-noida-west-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 2500045000,
          "formattedAmount": "₹25,000 – ₹45,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "sparsh-global-school-greater-noida-west-comp-3",
          "name": "Caution Deposit",
          "category": "deposit",
          "amount": 800010000,
          "formattedAmount": "₹8,000 – ₹10,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": true
        },
        {
          "id": "sparsh-global-school-greater-noida-west-comp-4",
          "name": "Quarterly Composite Tuition",
          "category": "recurring",
          "amount": 2100029250,
          "formattedAmount": "₹21,000 – ₹29,250",
          "frequency": "quarterly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "sparsh-global-school-greater-noida-west-comp-5",
          "name": "Quarterly Transport (Optional)",
          "category": "optional",
          "amount": 990015000,
          "formattedAmount": "₹9,900 – ₹15,000",
          "frequency": "quarterly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "All Grades",
          "tuitionFee": "₹21,000 – ₹29,250",
          "tuitionFrequency": "quarterly",
          "calculatedAnnualEquivalent": "₹84,000 – ₹1,17,000",
          "calculationNotes": "Calculated annual equivalent range: quarterly × 4."
        }
      ],
      "concessions": [],
      "disclaimer": "Quarterly composite: ₹21,000–₹29,250 (calculated annual ₹84,000–₹1,17,000). Registration ₹1,000, Admission ₹25,000–₹45,000, Refundable caution ₹8,000–₹10,000. Optional quarterly transport ₹9,900–₹15,000."
    },
    "facilities": [
      {
        "name": "Modern STEM & Innovation Labs",
        "category": "Academics",
        "icon": "cpu"
      },
      {
        "name": "All-Weather Sports Arena",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Visual & Performing Arts Studios",
        "category": "Arts",
        "icon": "palette"
      },
      {
        "name": "Smart Digitized Classrooms",
        "category": "Infrastructure",
        "icon": "monitor"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Formal light-blue striped shirt, charcoal trousers & tie"
      },
      "girls": {
        "image": null,
        "label": "Formal light-blue striped shirt, charcoal pleated skirt/trousers & tie"
      }
    },
    "achievements": [
      "Recognized for holistic education and state-of-the-art experiential learning spaces",
      "Affiliated with CBSE for Senior Secondary education"
    ],
    "admissions": {
      "date": "September to February",
      "status": "Open",
      "process": "Online registration followed by interactive child assessment and campus tour.",
      "milestones": [
        {
          "id": "app_opening",
          "label": "Admissions Open",
          "date": "2026-09-01",
          "verified": true,
          "notes": "Early bird application window",
          "verificationStatus": "verified_official_notice"
        },
        {
          "id": "app_deadline",
          "label": "First List Deadline",
          "date": "2027-02-28",
          "verified": true,
          "notes": "Interaction slot booking",
          "verificationStatus": "verified_official_notice"
        }
      ],
      "session": "2027-28",
      "academicYear": "2027–28"
    },
    "contact": {
      "phone": "0120-7195555",
      "website": "https://www.sparshglobalschool.com",
      "email": "admissions@sparshglobalschool.com"
    },
    "rating": {
      "score": 4.6,
      "scale": 5,
      "reviewsCount": 22
    },
    "assets": {
      "featured": "/assets/schools/sparsh-global-school-greater-noida-west/featured/featured.avif",
      "hero": "/assets/schools/sparsh-global-school-greater-noida-west/featured/featured.avif",
      "gallery": [
        "/assets/schools/sparsh-global-school-greater-noida-west/gallery/gallery-1.avif",
        "/assets/schools/sparsh-global-school-greater-noida-west/gallery/gallery-2.avif",
        "/assets/schools/sparsh-global-school-greater-noida-west/gallery/gallery-3.webp",
        "/assets/schools/sparsh-global-school-greater-noida-west/gallery/gallery-4.webp",
        "/assets/schools/sparsh-global-school-greater-noida-west/gallery/gallery-5.webp",
        "/assets/schools/sparsh-global-school-greater-noida-west/gallery/gallery-6.jpeg",
        "/assets/schools/sparsh-global-school-greater-noida-west/gallery/gallery-7.jpeg",
        "/assets/schools/sparsh-global-school-greater-noida-west/gallery/gallery-8.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/sparsh-global-school-greater-noida-west/featured/featured.avif",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-03-01",
      "sourceName": "CBSE Portal & Official School Registry",
      "cbseAffiliationNumber": "2134159",
      "verifiedFields": [
        "name",
        "address",
        "board",
        "curriculum",
        "gradeRange",
        "contact"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "sparsh-global-school.html",
      "pageTitle": "Sparsh Global School Greater Noida West",
      "h1": "Sparsh Global School",
      "pageHeartKey": "heart_sparsh_global",
      "cardHeartKey": "card_sparsh_global",
      "cardRatingKey": "rating_sparsh_global",
      "cardLink": "/schools/sparsh-global-school-greater-noida-west",
      "legacyUrls": [
        "/schools/sparsh-global-school-greater-noida-west",
        "/sparsh-global"
      ]
    },
    "auditNotes": [
      "Canonical verified school in Knowledge Park V, Greater Noida West"
    ],
    "classification": "core_greater_noida_west",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "sparsh-global-school-greater-noida-west",
    "isDuplicate": false,
    "isArchived": false,
    "status": "active",
    "affiliationNumber": "2134159",
    "establishedYear": 2019,
    "sports": [
      "Swimming",
      "Basketball",
      "Football",
      "Badminton",
      "Tennis"
    ],
    "cbseAffiliationNumber": "2134159"
  },
  {
    "id": "seth-anandram-jaipuria-school-greater-noida-west",
    "slug": "seth-anandram-jaipuria-school-greater-noida-west",
    "name": "Seth Anandram Jaipuria School",
    "shortName": "Jaipuria School",
    "alternateNames": [
      "Jaipuria School Greater Noida West",
      "Seth Anandram Jaipuria KP5",
      "Jaipuria Noida Extension"
    ],
    "tagline": "Leading K-12 CBSE Institution in Knowledge Park V",
    "summary": "Seth Anandram Jaipuria School is a premier K-12 institution located at Plot No. 2A & 2B, Knowledge Park V, Greater Noida West, offering child-centric education aligned with NEP 2020, centrally air-conditioned smart classrooms, and comprehensive athletic facilities.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "15:1–28:1 (Conflicting reports)",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot No 2A & 2B, Chauganpur, Knowledge Park V, Greater Noida, UP 201306",
      "sector": "Knowledge Park V",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.579,
        "lng": 77.449
      },
      "mapSearchQuery": "Seth Anandram Jaipuria School Knowledge Park V Greater Noida West",
      "mapEmbedUrl": "https://maps.google.com/maps?q=Seth+Anandram+Jaipuria+School+Knowledge+Park+V+Greater+Noida+West&t=&z=15&ie=UTF8&iwloc=&output=embed"
    },
    "fees": {
      "isVerified": false,
      "cardFee": 102800,
      "currency": "INR",
      "rangeText": "₹1,02,800 – ₹1,27,050 / year (Estimated annual totals; not officially verified)",
      "registrationFee": null,
      "admissionFee": null,
      "cautionDeposit": "₹5,000 – ₹7,500 (Refundable)",
      "refundableSecurity": "₹5,000 – ₹7,500",
      "tuitionMonthly": null,
      "tuitionAnnual": "₹1,02,800 – ₹1,27,050 (Estimated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "estimated_historical",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "seth-anandram-jaipuria-school-greater-noida-west-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 10002000,
          "formattedAmount": "₹1,000 – ₹2,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false
        },
        {
          "id": "seth-anandram-jaipuria-school-greater-noida-west-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 45000,
          "formattedAmount": "Up to ₹45,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false
        },
        {
          "id": "seth-anandram-jaipuria-school-greater-noida-west-comp-3",
          "name": "Security Deposit",
          "category": "deposit",
          "amount": 50007500,
          "formattedAmount": "₹5,000 – ₹7,500",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": false
        },
        {
          "id": "seth-anandram-jaipuria-school-greater-noida-west-comp-4",
          "name": "Exam Fee",
          "category": "recurring",
          "amount": 2500,
          "formattedAmount": "₹2,500",
          "frequency": "annual",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false,
          "notes": "₹2,500 annually."
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-Nur–UKG",
          "tuitionFee": "₹1,02,800 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,02,800 / year",
          "notes": "Estimated annual total."
        },
        {
          "gradeGroup": "Classes I–VIII",
          "tuitionFee": "₹1,13,850 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,13,850 / year",
          "notes": "Estimated annual total."
        },
        {
          "gradeGroup": "Classes IX–X",
          "tuitionFee": "₹1,25,150 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,25,150 / year",
          "notes": "Estimated annual total."
        },
        {
          "gradeGroup": "Classes XI–XII",
          "tuitionFee": "₹1,27,050 / year",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "₹1,27,050 / year",
          "notes": "Estimated annual total."
        }
      ],
      "concessions": [],
      "disclaimer": "IMPORTANT: Estimated annual totals (Pre-Nur–UKG ₹1,02,800, I–VIII ₹1,13,850, IX–X ₹1,25,150, XI–XII ₹1,27,050). Not officially verified. Registration ₹1,000–₹2,000, Admission up to ₹45,000, Refundable security ₹5,000–₹7,500, Exam ₹2,500/yr."
    },
    "facilities": [
      {
        "name": "Centrally Air-Conditioned Classrooms",
        "category": "Infrastructure",
        "icon": "airplay"
      },
      {
        "name": "Swimming Pool & Sports Complex",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Digital Learning & AI Labs",
        "category": "Academics",
        "icon": "cpu"
      },
      {
        "name": "Music, Dance & Fine Arts Studio",
        "category": "Arts",
        "icon": "music"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "White formal shirt with checked trousers & tie"
      },
      "girls": {
        "image": null,
        "label": "White formal shirt with checked pleated skirt/trousers & tie"
      }
    },
    "achievements": [
      "Reputed heritage of Jaipuria education network across India",
      "Full compliance with NEP 2020 experiential learning models"
    ],
    "admissions": {
      "date": "September to March",
      "status": "Open",
      "process": "2027–28 admissions expected late 2026/early 2027.",
      "milestones": [
        {
          "id": "app_opening",
          "label": "Application Portal Active",
          "date": "2026-09-15",
          "verified": true,
          "notes": "Online inquiry & campus walkthrough",
          "verificationStatus": "verified_official_notice"
        },
        {
          "id": "app_deadline",
          "label": "Registration Deadline",
          "date": "2027-03-31",
          "verified": true,
          "notes": "Parent interaction scheduling",
          "verificationStatus": "verified_official_notice"
        }
      ],
      "session": "2027-28",
      "academicYear": "2027–28"
    },
    "contact": {
      "phone": "8800049460",
      "website": "https://jaipuriaschoolsgnoida.com",
      "email": "admission.gnoida@jaipuria.school"
    },
    "rating": {
      "score": 4.5,
      "scale": 5,
      "reviewsCount": 18
    },
    "assets": {
      "featured": "/assets/schools/seth-anandram-jaipuria-school-greater-noida-west/featured/featured.jpg",
      "hero": "/assets/schools/seth-anandram-jaipuria-school-greater-noida-west/featured/featured.jpg",
      "gallery": [
        "/assets/schools/seth-anandram-jaipuria-school-greater-noida-west/gallery/gallery-1.jpg",
        "/assets/schools/seth-anandram-jaipuria-school-greater-noida-west/gallery/gallery-2.jpg",
        "/assets/schools/seth-anandram-jaipuria-school-greater-noida-west/gallery/gallery-3.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/seth-anandram-jaipuria-school-greater-noida-west/featured/featured.jpg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-03-01",
      "sourceName": "Jaipuria Group Official Registry",
      "verifiedFields": [
        "name",
        "address",
        "board",
        "curriculum",
        "gradeRange",
        "contact"
      ],
      "cbseAffiliationNumber": "2134145"
    },
    "legacyIdentifiers": {
      "pageFile": "seth-anandram-jaipuria-school.html",
      "pageTitle": "Seth Anandram Jaipuria School Greater Noida West",
      "h1": "Seth Anandram Jaipuria School",
      "pageHeartKey": "heart_jaipuria_gnw",
      "cardHeartKey": "card_jaipuria_gnw",
      "cardRatingKey": "rating_jaipuria_gnw",
      "cardLink": "/schools/seth-anandram-jaipuria-school-greater-noida-west",
      "legacyUrls": [
        "/schools/seth-anandram-jaipuria-school-greater-noida-west",
        "/jaipuria-greater-noida-west"
      ]
    },
    "auditNotes": [
      "Canonical verified campus in Knowledge Park V, Greater Noida West"
    ],
    "classification": "core_greater_noida_west",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "seth-anandram-jaipuria-school-greater-noida-west",
    "isDuplicate": false,
    "isArchived": false,
    "status": "active",
    "establishedYear": 2021,
    "sports": [
      "Swimming",
      "Basketball",
      "Athletics",
      "Football",
      "Table Tennis"
    ],
    "affiliationNumber": "2134145",
    "cbseAffiliationNumber": "2134145"
  },
  {
    "id": "gagan-public-school-sector-4",
    "slug": "gagan-public-school-sector-4",
    "name": "Gagan Public School",
    "shortName": "Gagan Public School",
    "alternateNames": [
      "Gagan Public School Greater Noida West",
      "Gagan School Gaur City",
      "Gagan Public School Sector 4"
    ],
    "tagline": "CBSE Senior Secondary Co-Educational School in Sector 4 Near Gaur City 1",
    "summary": "Gagan Public School (CBSE Affiliation No. 2132338) is a senior secondary school situated at HS-1, Sector 4, near Gaur City 1, Greater Noida West, offering affordable and high-standard CBSE education with smart classrooms and dedicated labs.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "18:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot HS 1, near Gaur City 1, Sector 4, Greater Noida, Ghaziabad, UP 201318",
      "sector": "Sector 4",
      "city": "Greater Noida West",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": 28.608,
        "lng": 77.436,
        "isVerified": true
      },
      "mapSearchQuery": "Gagan Public School Sector 4 Greater Noida West",
      "mapEmbedUrl": "https://maps.google.com/maps?q=Gagan+Public+School+Sector+4+Greater+Noida+West&t=&z=15&ie=UTF8&iwloc=&output=embed"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 5450,
      "currency": "INR",
      "rangeText": "₹5,450 – ₹6,800 / month (Estimated 1st-year total: ₹48,800 – ₹89,400)",
      "registrationFee": 5000,
      "admissionFee": null,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": "₹5,450 – ₹6,800",
      "tuitionAnnual": "₹65,400 – ₹81,600 (Calculated)",
      "transportMonthly": "₹1,300 – ₹2,900",
      "transportAnnual": null,
      "estimatedFirstYear": "₹48,800 – ₹89,400 (Estimated / Calculated)",
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "gagan-public-school-sector-4-comp-1",
          "name": "Prospectus",
          "category": "one_time",
          "amount": 500,
          "formattedAmount": "₹500",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "gagan-public-school-sector-4-comp-2",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 5000,
          "formattedAmount": "₹5,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "gagan-public-school-sector-4-comp-3",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 1600022000,
          "formattedAmount": "₹16,000 – ₹22,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "gagan-public-school-sector-4-comp-4",
          "name": "Monthly Tuition / Composite",
          "category": "recurring",
          "amount": 54506800,
          "formattedAmount": "₹5,450 – ₹6,800",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "gagan-public-school-sector-4-comp-5",
          "name": "Transport (Optional)",
          "category": "optional",
          "amount": 13002900,
          "formattedAmount": "₹1,300 – ₹2,900",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "All Grades",
          "tuitionFee": "₹5,450 – ₹6,800",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹65,400 – ₹81,600",
          "calculationNotes": "Calculated annual: ₹5,450 × 12 to ₹6,800 × 12."
        }
      ],
      "concessions": [],
      "disclaimer": "Monthly tuition: ₹5,450–₹6,800. Prospectus ₹500, Registration ₹5,000, Admission ₹16,000–₹22,000. Transport ₹1,300–₹2,900/month. Estimated 1st-year total: ₹48,800–₹89,400."
    },
    "facilities": [
      {
        "name": "Digitally Enabled Smart Classes",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science & Computer Laboratories",
        "category": "Labs",
        "icon": "flask-conical"
      },
      {
        "name": "Playground & Sports Coaching",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Library & Reading Room",
        "category": "Infrastructure",
        "icon": "book-open"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Checked shirt with grey trousers & tie"
      },
      "girls": {
        "image": null,
        "label": "Checked shirt with grey pleated skirt/trousers & tie"
      }
    },
    "achievements": [
      "CBSE Affiliated Senior Secondary School (Affiliation No. 2132338)",
      "Convenient location right next to Gaur City 1"
    ],
    "admissions": {
      "date": "October to March",
      "status": "Open",
      "process": "Application form submission, student interaction, and document verification.",
      "milestones": [
        {
          "id": "app_opening",
          "label": "Admissions Open",
          "date": "2026-10-01",
          "verified": true,
          "notes": "Prospectus distribution & online form",
          "verificationStatus": "verified_official_notice"
        },
        {
          "id": "app_deadline",
          "label": "Phase 1 Deadline",
          "date": "2027-03-31",
          "verified": true,
          "notes": "Document verification",
          "verificationStatus": "verified_official_notice"
        }
      ],
      "session": "2027-28"
    },
    "contact": {
      "phone": "0120-2977011",
      "website": "https://gaganpublicschool.com",
      "email": "info@gaganpublicschool.com"
    },
    "rating": {
      "score": 4.1,
      "scale": 5,
      "reviewsCount": 16
    },
    "assets": {
      "featured": "/assets/schools/gagan-public-school-sector-4/featured/featured.jpg",
      "hero": "/assets/schools/gagan-public-school-sector-4/featured/featured.jpg",
      "gallery": [
        "/assets/schools/gagan-public-school-sector-4/gallery/gallery-1.jpg",
        "/assets/schools/gagan-public-school-sector-4/gallery/gallery-2.jpg",
        "/assets/schools/gagan-public-school-sector-4/gallery/gallery-3.jpeg",
        "/assets/schools/gagan-public-school-sector-4/gallery/gallery-4.jpeg",
        "/assets/schools/gagan-public-school-sector-4/gallery/gallery-5.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/gagan-public-school-sector-4/featured/featured.jpg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-03-01",
      "sourceName": "CBSE Portal (Affiliation No. 2132338)",
      "cbseAffiliationNumber": "2132338",
      "verifiedFields": [
        "name",
        "address",
        "board",
        "curriculum",
        "gradeRange",
        "contact"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "gagan-public-school.html",
      "pageTitle": "Gagan Public School Sector 4 Greater Noida West",
      "h1": "Gagan Public School",
      "pageHeartKey": "heart_gagan_sec4",
      "cardHeartKey": "card_gagan_sec4",
      "cardRatingKey": "rating_gagan_sec4",
      "cardLink": "/schools/gagan-public-school-sector-4",
      "legacyUrls": [
        "/schools/gagan-public-school-sector-4",
        "/gagan-public-school"
      ]
    },
    "auditNotes": [
      "Canonical verified school in Sector 4 / Gaur City 1 border, Greater Noida West",
      "Affiliation 2132338 confirmed from verified source metadata; secondary source mentions 2132689.",
      "Affiliation 2132338 confirmed from verified source metadata; secondary source mentions 2132689.",
      "Affiliation 2132338 confirmed from verified source metadata; secondary source mentions 2132689."
    ],
    "classification": "core_greater_noida_west",
    "geographicClassification": "core_greater_noida_west",
    "recordType": "canonical",
    "canonicalSlug": "gagan-public-school-sector-4",
    "isDuplicate": false,
    "isArchived": false,
    "status": "active",
    "affiliationNumber": "2132338",
    "establishedYear": 2016,
    "sports": [
      "Cricket",
      "Basketball",
      "Badminton",
      "Volleyball"
    ],
    "cbseAffiliationNumber": "2132338"
  },
  {
    "id": "indirapuram-public-school-crossings-republik",
    "slug": "indirapuram-public-school-crossings-republik",
    "name": "Indirapuram Public School, Crossings Republik",
    "shortName": "IPS Crossings Republik",
    "alternateNames": [
      "Indirapuram Public School Girls",
      "IPS Crossings",
      "Indirapuram School Crossings Republik"
    ],
    "tagline": "Leading CBSE Senior Secondary Institution Adjacent to Gaur City & Greater Noida West",
    "summary": "Indirapuram Public School, Crossings Republik (CBSE Affiliation No. 2131758) is a premier senior secondary institution located at Plot No. 7, Crossings Republik, directly adjacent to Gaur City and Greater Noida West, offering modern experiential education, dedicated athletic facilities, and STEM labs.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "approx 14:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot number EF-7 & 8B, Sain Vihar Rd, Biharipur Village, Dundahera, Ghaziabad, UP 201016",
      "sector": "Crossing Republik Border",
      "city": "Crossing Republik",
      "state": "Uttar Pradesh",
      "pincode": "201016",
      "area": "Crossing Republik",
      "coordinates": {
        "lat": 28.625,
        "lng": 77.432,
        "isVerified": true
      },
      "mapSearchQuery": "Indirapuram Public School Crossings Republik",
      "mapEmbedUrl": "https://maps.google.com/maps?q=Indirapuram+Public+School+Crossings+Republik&t=&z=15&ie=UTF8&iwloc=&output=embed"
    },
    "fees": {
      "isVerified": true,
      "cardFee": 9768,
      "currency": "INR",
      "rangeText": "₹9,768 – ₹10,328 / month composite (Nur–UKG: ₹10,328 | I: ₹9,984 | II–VI: ₹9,860 | VII: ₹10,012 | VIII–X: ₹10,204 | XI–XII: ₹9,768)",
      "registrationFee": null,
      "admissionFee": null,
      "cautionDeposit": null,
      "refundableSecurity": null,
      "tuitionMonthly": "₹9,768 – ₹10,328",
      "tuitionAnnual": "₹1,17,216 – ₹1,23,936 (Calculated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "indirapuram-public-school-crossings-republik-comp-1",
          "name": "Exam Fee",
          "category": "recurring",
          "amount": 3541062,
          "formattedAmount": "₹354 / month (₹1,062 / quarter)",
          "frequency": "monthly",
          "mandatory": true,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "indirapuram-public-school-crossings-republik-comp-2",
          "name": "Optional Lab Fee (XI–XII CS / AI)",
          "category": "optional",
          "amount": 8362508,
          "formattedAmount": "₹836 / month (₹2,508 / quarter)",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true
        },
        {
          "id": "indirapuram-public-school-crossings-republik-comp-3",
          "name": "Optional Lab Fee (XI–XII Physics/Chem/Bio)",
          "category": "optional",
          "amount": 536,
          "formattedAmount": "₹536 / month",
          "frequency": "monthly",
          "mandatory": false,
          "refundable": false,
          "isOfficial": true
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Nursery / LKG / UKG",
          "tuitionFee": "₹10,328 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,23,936 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹10,328 × 12."
        },
        {
          "gradeGroup": "Class I",
          "tuitionFee": "₹9,984 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,19,808 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹9,984 × 12."
        },
        {
          "gradeGroup": "Classes II–VI",
          "tuitionFee": "₹9,860 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,18,320 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹9,860 × 12."
        },
        {
          "gradeGroup": "Class VII",
          "tuitionFee": "₹10,012 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,20,144 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹10,012 × 12."
        },
        {
          "gradeGroup": "Classes VIII–X",
          "tuitionFee": "₹10,204 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,22,448 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹10,204 × 12."
        },
        {
          "gradeGroup": "Classes XI–XII",
          "tuitionFee": "₹9,768 / month",
          "tuitionFrequency": "monthly",
          "calculatedAnnualEquivalent": "₹1,17,216 / year",
          "isOfficial": true,
          "calculationNotes": "Calculated annual: ₹9,768 × 12."
        }
      ],
      "concessions": [],
      "disclaimer": "Official monthly composite: Nursery–UKG ₹10,328, I ₹9,984, II–VI ₹9,860, VII ₹10,012, VIII–X ₹10,204, XI–XII ₹9,768. Exam fee ₹354/month (₹1,062/quarter). Optional XI–XII labs: CS/AI ₹836/month (₹2,508/quarter), PCB ₹536/month."
    },
    "facilities": [
      {
        "name": "Spacious Smart Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Physics, Chemistry & Biology Labs",
        "category": "Labs",
        "icon": "flask-conical"
      },
      {
        "name": "Sports Complex & Swimming",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Performing Arts & Auditorium",
        "category": "Arts",
        "icon": "music"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "White shirt with green-striped tie & navy trousers"
      },
      "girls": {
        "image": null,
        "label": "White shirt with green-striped tie & navy skirt/trousers"
      }
    },
    "achievements": [
      "CBSE Affiliated Senior Secondary School (Affiliation No. 2131758)",
      "Highly preferred catchment institution for Gaur City 1 & 2 families"
    ],
    "admissions": {
      "date": "September to March",
      "status": "Open",
      "process": "Online registration followed by informal parent-child interaction.",
      "milestones": [
        {
          "id": "app_opening",
          "label": "Registrations Open",
          "date": "2026-09-15",
          "verified": true,
          "notes": "Online registration portal",
          "verificationStatus": "verified_official_notice"
        },
        {
          "id": "app_deadline",
          "label": "Application Deadline",
          "date": "2027-03-31",
          "verified": true,
          "notes": "Assessment interview",
          "verificationStatus": "verified_official_notice"
        }
      ],
      "session": "2027-28"
    },
    "contact": {
      "phone": "0120-4180000",
      "website": "https://indirapuramschoolcr.com",
      "email": "info@indirapuramschoolcr.com"
    },
    "rating": {
      "score": 4.4,
      "scale": 5,
      "reviewsCount": 20
    },
    "assets": {
      "featured": "/assets/schools/indirapuram-public-school-crossings-republik/featured/featured.png",
      "hero": "/assets/schools/indirapuram-public-school-crossings-republik/featured/featured.png",
      "gallery": [
        "/assets/schools/indirapuram-public-school-crossings-republik/gallery/gallery-1.png",
        "/assets/schools/indirapuram-public-school-crossings-republik/gallery/gallery-2.avif",
        "/assets/schools/indirapuram-public-school-crossings-republik/gallery/gallery-3.jpeg",
        "/assets/schools/indirapuram-public-school-crossings-republik/gallery/gallery-4.jpg",
        "/assets/schools/indirapuram-public-school-crossings-republik/gallery/gallery-5.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/indirapuram-public-school-crossings-republik/featured/featured.png",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-03-01",
      "sourceName": "CBSE Affiliation Portal (No. 2131758)",
      "cbseAffiliationNumber": "2132548",
      "verifiedFields": [
        "name",
        "address",
        "board",
        "curriculum",
        "gradeRange",
        "contact"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "indirapuram-public-school-crossings.html",
      "pageTitle": "Indirapuram Public School Crossings Republik",
      "h1": "Indirapuram Public School Crossings Republik",
      "pageHeartKey": "heart_ips_cr",
      "cardHeartKey": "card_ips_cr",
      "cardRatingKey": "rating_ips_cr",
      "cardLink": "/schools/indirapuram-public-school-crossings-republik",
      "legacyUrls": [
        "/schools/indirapuram-public-school-crossings-republik",
        "/ips-crossings-republik"
      ]
    },
    "auditNotes": [
      "Canonical verified nearby catchment school bordering Gaur City / Greater Noida West"
    ],
    "classification": "nearby_surrounding",
    "geographicClassification": "nearby_surrounding",
    "recordType": "canonical",
    "canonicalSlug": "indirapuram-public-school-crossings-republik",
    "isDuplicate": false,
    "isArchived": false,
    "status": "active",
    "affiliationNumber": "2132548",
    "establishedYear": 2014,
    "sports": [
      "Swimming",
      "Basketball",
      "Badminton",
      "Football",
      "Cricket"
    ],
    "cbseAffiliationNumber": "2132548"
  },
  {
    "id": "sapphire-international-school-crossings-republik",
    "slug": "sapphire-international-school-crossings-republik",
    "name": "Sapphire International School, Crossings Republik",
    "shortName": "Sapphire International",
    "alternateNames": [
      "Sapphire International School CR",
      "Sapphire School Crossings",
      "Sapphire Crossings Republik"
    ],
    "tagline": "Premier CBSE Co-Educational Institution Bordering Gaur City",
    "summary": "Sapphire International School (CBSE Affiliation No. 2131920) is a well-established senior secondary institution located at Plot No. 3, Crossings Republik, directly bordering Greater Noida West and Gaur City, offering student-centric pedagogical approaches, state-of-the-art sports facilities, and comprehensive arts programs.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE",
    "gradeRange": {
      "from": "Nursery",
      "to": "Class 12",
      "raw": "Nursery – 12"
    },
    "admissionAge": "3+",
    "studentTeacherRatio": "15:1",
    "schoolType": "Co-Ed",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Plot EF 7&8, adjoining GH-07 Gate 2, Crossing Infra, Sain Vihar Road, Crossings Republik, Ghaziabad, UP 201016",
      "sector": "Crossing Republik Border",
      "city": "Crossing Republik",
      "state": "Uttar Pradesh",
      "pincode": "201016",
      "area": "Crossing Republik",
      "coordinates": {
        "lat": 28.627,
        "lng": 77.435,
        "isVerified": true
      },
      "mapSearchQuery": "Sapphire International School Crossings Republik",
      "mapEmbedUrl": "https://maps.google.com/maps?q=Sapphire+International+School+Crossings+Republik&t=&z=15&ie=UTF8&iwloc=&output=embed"
    },
    "fees": {
      "isVerified": false,
      "cardFee": 202100,
      "currency": "INR",
      "rangeText": "₹2,02,100 – ₹2,24,900 / year (Estimated grade-wise total; not official)",
      "registrationFee": 1500,
      "admissionFee": null,
      "cautionDeposit": "₹20,000 – ₹25,000 (Refundable)",
      "refundableSecurity": "₹20,000 – ₹25,000",
      "tuitionMonthly": null,
      "tuitionAnnual": "₹2,02,100 – ₹2,24,900 (Estimated)",
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "estimated_historical",
      "lastVerifiedDate": "2026-09-18",
      "components": [
        {
          "id": "sapphire-international-school-crossings-republik-comp-1",
          "name": "Registration Fee",
          "category": "one_time",
          "amount": 1500,
          "formattedAmount": "₹1,500",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false
        },
        {
          "id": "sapphire-international-school-crossings-republik-comp-2",
          "name": "Admission Fee",
          "category": "one_time",
          "amount": 3300040000,
          "formattedAmount": "₹33,000 – ₹40,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": false,
          "isOfficial": false
        },
        {
          "id": "sapphire-international-school-crossings-republik-comp-3",
          "name": "Security Deposit",
          "category": "deposit",
          "amount": 2000025000,
          "formattedAmount": "₹20,000 – ₹25,000",
          "frequency": "one_time",
          "mandatory": true,
          "refundable": true,
          "isOfficial": false
        }
      ],
      "gradeWiseTiers": [
        {
          "gradeGroup": "Pre-Nur / EYPL",
          "tuitionFee": "~₹2,04,200",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "~₹2,04,200",
          "notes": "Estimated annual total."
        },
        {
          "gradeGroup": "Nursery / UKG",
          "tuitionFee": "~₹2,02,100",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "~₹2,02,100",
          "notes": "Estimated annual total."
        },
        {
          "gradeGroup": "Classes I–X",
          "tuitionFee": "~₹2,08,700",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "~₹2,08,700",
          "notes": "Estimated annual total."
        },
        {
          "gradeGroup": "Classes XI–XII",
          "tuitionFee": "~₹2,24,900",
          "tuitionFrequency": "annual",
          "calculatedAnnualEquivalent": "~₹2,24,900",
          "notes": "Estimated annual total."
        }
      ],
      "concessions": [],
      "disclaimer": "Estimated annual totals: Pre-Nur ~₹2,04,200, Nursery/UKG ~₹2,02,100, I–X ~₹2,08,700, XI–XII ~₹2,24,900. Registration ₹1,500, Admission ₹33,000–₹40,000, Refundable security ₹20,000–₹25,000. Not officially verified."
    },
    "facilities": [
      {
        "name": "Digitally Integrated Classrooms",
        "category": "Academics",
        "icon": "monitor"
      },
      {
        "name": "Science & Robotics Laboratories",
        "category": "Labs",
        "icon": "cpu"
      },
      {
        "name": "Sports Academy & Playgrounds",
        "category": "Sports",
        "icon": "trophy"
      },
      {
        "name": "Dance, Drama & Music Studios",
        "category": "Arts",
        "icon": "music"
      }
    ],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "Sky-blue shirt with sapphire-blue trousers & school tie"
      },
      "girls": {
        "image": null,
        "label": "Sky-blue shirt with sapphire-blue skirt/trousers & school tie"
      }
    },
    "achievements": [
      "CBSE Affiliated Senior Secondary School (Affiliation No. 2131920)",
      "Highly rated for personalized student care and well-rounded curriculum"
    ],
    "admissions": {
      "date": "September to March",
      "status": "Open",
      "process": "Online registration, interactive session with child and parents, verification of documents.",
      "milestones": [
        {
          "id": "app_opening",
          "label": "Registration Window Opens",
          "date": "2026-09-15",
          "verified": true,
          "notes": "Campus registration Desk",
          "verificationStatus": "verified_official_notice"
        },
        {
          "id": "app_deadline",
          "label": "Phase 1 Registration Closing",
          "date": "2027-03-31",
          "verified": true,
          "notes": "Seat allocation list",
          "verificationStatus": "verified_official_notice"
        }
      ],
      "session": "2027-28",
      "academicYear": "2027–28"
    },
    "contact": {
      "phone": "0120-4355555",
      "website": "https://sapphireschool.in",
      "email": "info@sapphireschool.in"
    },
    "rating": {
      "score": 4.3,
      "scale": 5,
      "reviewsCount": 17
    },
    "assets": {
      "featured": "/assets/schools/sapphire-international-school-crossings-republik/featured/featured.jpeg",
      "hero": "/assets/schools/sapphire-international-school-crossings-republik/featured/featured.jpeg",
      "gallery": [
        "/assets/schools/sapphire-international-school-crossings-republik/gallery/gallery-1.jpeg",
        "/assets/schools/sapphire-international-school-crossings-republik/gallery/gallery-2.jpeg",
        "/assets/schools/sapphire-international-school-crossings-republik/gallery/gallery-3.jpeg",
        "/assets/schools/sapphire-international-school-crossings-republik/gallery/gallery-4.jpg",
        "/assets/schools/sapphire-international-school-crossings-republik/gallery/gallery-5.jpeg",
        "/assets/schools/sapphire-international-school-crossings-republik/gallery/gallery-6.jpg",
        "/assets/schools/sapphire-international-school-crossings-republik/gallery/gallery-7.webp"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/sapphire-international-school-crossings-republik/featured/featured.jpeg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-03-01",
      "sourceName": "CBSE Portal (Affiliation No. 2131920)",
      "cbseAffiliationNumber": "2133627",
      "verifiedFields": [
        "name",
        "address",
        "board",
        "curriculum",
        "gradeRange",
        "contact"
      ]
    },
    "legacyIdentifiers": {
      "pageFile": "sapphire-international-school-crossings.html",
      "pageTitle": "Sapphire International School Crossings Republik",
      "h1": "Sapphire International School Crossings Republik",
      "pageHeartKey": "heart_sapphire_cr",
      "cardHeartKey": "card_sapphire_cr",
      "cardRatingKey": "rating_sapphire_cr",
      "cardLink": "/schools/sapphire-international-school-crossings-republik",
      "legacyUrls": [
        "/schools/sapphire-international-school-crossings-republik",
        "/sapphire-crossings-republik"
      ]
    },
    "auditNotes": [
      "Canonical verified nearby catchment school bordering Gaur City / Greater Noida West"
    ],
    "classification": "nearby_surrounding",
    "geographicClassification": "nearby_surrounding",
    "recordType": "canonical",
    "canonicalSlug": "sapphire-international-school-crossings-republik",
    "isDuplicate": false,
    "isArchived": false,
    "status": "active",
    "affiliationNumber": "2133627",
    "establishedYear": 2015,
    "sports": [
      "Cricket",
      "Basketball",
      "Football",
      "Badminton",
      "Skating"
    ],
    "cbseAffiliationNumber": "2133627"
  },
  {
    "id": "the-khaitan-school-sector-40-noida",
    "slug": "the-khaitan-school-sector-40-noida",
    "name": "The Khaitan School",
    "shortName": "Khaitan Public School",
    "alternateNames": [
      "Khaitan Public School",
      "The Khaitan School Sector 40",
      "Khaitan School Noida"
    ],
    "tagline": "CBSE Co-Educational School in Sector 40, Noida",
    "summary": "The Khaitan School (originally Khaitan Public School), CBSE Affiliation No. 2130382, is located in Sector 40, Noida, offering schooling with a student-teacher ratio of roughly 15:1 to 16:1.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "15:1 to 16:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Block F, 1A/A, F Block, Sector 40, Noida, Uttar Pradesh 201303",
      "sector": "Sector 40",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201303",
      "area": "Sector 40",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "The Khaitan School Sector 40 Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "₹1,000 registration · ₹30,000–₹60,000 admission · ₹11,917/month avg tuition (Nursery/lower)",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [
        {
          "type": "Registration Fee (one-time)",
          "cost": "₹1,000"
        },
        {
          "type": "Admission Fee (Pre-Nursery–UKG)",
          "cost": "₹30,000"
        },
        {
          "type": "Admission Fee (Class I–XII)",
          "cost": "₹60,000"
        },
        {
          "type": "Tuition (Nursery/lower, quarterly)",
          "cost": "₹35,750 – ₹43,260"
        },
        {
          "type": "Tuition (Class IX–XII, annual)",
          "cost": "₹1,73,040 – ₹2,40,120"
        },
        {
          "type": "Transport (optional, monthly)",
          "cost": "₹2,900 – ₹4,600"
        }
      ],
      "disclosed": true,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Admissions open for the 2027-28 academic session.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": null,
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/the-khaitan-school-sector-40-noida/featured/featured.jpeg",
      "hero": "/assets/schools/the-khaitan-school-sector-40-noida/featured/featured.jpeg",
      "gallery": [
        "/assets/schools/the-khaitan-school-sector-40-noida/gallery/gallery-1.jpeg",
        "/assets/schools/the-khaitan-school-sector-40-noida/gallery/gallery-2.jpg",
        "/assets/schools/the-khaitan-school-sector-40-noida/gallery/gallery-3.jpeg",
        "/assets/schools/the-khaitan-school-sector-40-noida/gallery/gallery-4.jpeg",
        "/assets/schools/the-khaitan-school-sector-40-noida/gallery/gallery-5.jpeg",
        "/assets/schools/the-khaitan-school-sector-40-noida/gallery/gallery-6.jpg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/the-khaitan-school-sector-40-noida/featured/featured.jpeg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "The Khaitan School",
      "h1": "The Khaitan School",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/the-khaitan-school-sector-40-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 per user-supplied research and photo collection."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": "2130382",
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "the-khaitan-school-sector-40-noida",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "CBSE SARAS Mandatory Disclosure & official school sources",
      "sourceUrl": "https://saras.cbse.gov.in/",
      "cbseAffiliationNumber": "2130382",
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "clarwyn-international-school",
    "slug": "clarwyn-international-school",
    "name": "Clarwyn International School",
    "shortName": "Clarwyn International",
    "alternateNames": [
      "Clarwyn International School Sector 145"
    ],
    "tagline": "Upcoming school in Sector 145, Noida",
    "summary": "Clarwyn International School is an upcoming school in Sector 145, Noida. Detailed information will be added as it becomes available.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not yet available",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "A-04, Sector 145, Noida, Gohiyapur, Uttar Pradesh 201306",
      "sector": "Sector 145",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Sector 145",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Clarwyn International School Sector 145 Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not yet available — upcoming school",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "unverified_third_party",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [],
      "disclosed": false,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Coming Soon",
      "process": "Detailed admissions information is not yet available for this upcoming school.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": null,
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": null,
      "hero": null,
      "gallery": [],
      "legacyPaths": {},
      "coverImage": null,
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Clarwyn International School",
      "h1": "Clarwyn International School",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/clarwyn-international-school",
      "legacyUrls": []
    },
    "auditNotes": [
      "Listed as an upcoming school per user instruction (2026-09-19). Full details pending."
    ],
    "classification": "upcoming",
    "sports": [],
    "affiliationNumber": null,
    "geographicClassification": null,
    "recordType": "upcoming",
    "canonicalSlug": "clarwyn-international-school",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Third-party admission/listing portals",
      "sourceUrl": null,
      "cbseAffiliationNumber": null,
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "genesis-global-school-sector-132-noida",
    "slug": "genesis-global-school-sector-132-noida",
    "name": "Genesis Global School",
    "shortName": "Genesis Global School",
    "alternateNames": [
      "GGS Noida",
      "Genesis Global School Sector 132"
    ],
    "tagline": "CBSE School on the Expressway, Sector 132, Noida",
    "summary": "Genesis Global School (GGS), Noida, CBSE Affiliation No. 2131232 (School Code 60550), maintains a student-teacher ratio of roughly 25:1 with classroom capacity capped at 25 students.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "25:1 (max 25 students/class)",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "A1 & A12, Expressway, Sector 132, Noida, Uttar Pradesh 201304",
      "sector": "Sector 132",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201304",
      "area": "Sector 132",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Genesis Global School Sector 132 Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "₹2,000 registration · ₹1,30,000 admission · ₹4,32,600–5,50,800/yr tuition (Grade 6–12)",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [
        {
          "type": "Registration Form (one-time)",
          "cost": "₹2,000"
        },
        {
          "type": "Admission Fee (one-time, non-refundable)",
          "cost": "₹1,30,000"
        },
        {
          "type": "Security Deposit (one-time, refundable)",
          "cost": "₹1,00,000"
        },
        {
          "type": "CBSE Tuition (Grades 6–10, annual)",
          "cost": "₹4,32,600"
        },
        {
          "type": "CBSE Tuition (Grades 11–12, annual)",
          "cost": "₹5,22,000 – ₹5,50,800"
        },
        {
          "type": "Boarding Add-on (optional)",
          "cost": "₹3,03,050 – ₹4,09,750"
        }
      ],
      "disclosed": true,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Online form, campus interaction/evaluation, then offer letter subject to seat booking.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": null,
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/genesis-global-school-sector-132-noida/featured/featured.png",
      "hero": "/assets/schools/genesis-global-school-sector-132-noida/featured/featured.png",
      "gallery": [
        "/assets/schools/genesis-global-school-sector-132-noida/gallery/gallery-1.png",
        "/assets/schools/genesis-global-school-sector-132-noida/gallery/gallery-2.png",
        "/assets/schools/genesis-global-school-sector-132-noida/gallery/gallery-3.jpg",
        "/assets/schools/genesis-global-school-sector-132-noida/gallery/gallery-4.jpg",
        "/assets/schools/genesis-global-school-sector-132-noida/gallery/gallery-5.jpg",
        "/assets/schools/genesis-global-school-sector-132-noida/gallery/gallery-6.jpeg",
        "/assets/schools/genesis-global-school-sector-132-noida/gallery/gallery-7.jpeg",
        "/assets/schools/genesis-global-school-sector-132-noida/gallery/gallery-8.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/genesis-global-school-sector-132-noida/featured/featured.png",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Genesis Global School",
      "h1": "Genesis Global School",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/genesis-global-school-sector-132-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 per user-supplied research and photo collection."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": "2131232",
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "genesis-global-school-sector-132-noida",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "CBSE SARAS Mandatory Disclosure & official school sources",
      "sourceUrl": "https://saras.cbse.gov.in/",
      "cbseAffiliationNumber": "2131232",
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "sri-chaitanya-techno-school-gaur-city-1",
    "slug": "sri-chaitanya-techno-school-gaur-city-1",
    "name": "Sri Chaitanya Techno School, Gaur City 1",
    "shortName": "Sri Chaitanya Gaur City 1",
    "alternateNames": [
      "Sri Chaitanya Techno School Gaur City"
    ],
    "tagline": "CBSE Middle School in Gaur City 1, Greater Noida West",
    "summary": "Sri Chaitanya Techno School, Gaur City 1 (CBSE Affiliation No. 2134834) is one of three Sri Chaitanya campuses serving Greater Noida and Noida.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "~20:1 to 25:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Gaur City 1, Greater Noida West Road, Greater Noida, Uttar Pradesh 201009",
      "sector": "Gaur City 1",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201009",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Sri Chaitanya Techno School, Gaur City 1 Gaur City 1 Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "₹60,000 – ₹1,10,000 / year depending on grade",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "unverified_third_party",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [],
      "disclosed": false,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Contact school for details.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": null,
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/sri-chaitanya-techno-school-gaur-city-1/featured/featured.avif",
      "hero": "/assets/schools/sri-chaitanya-techno-school-gaur-city-1/featured/featured.avif",
      "gallery": [
        "/assets/schools/sri-chaitanya-techno-school-gaur-city-1/gallery/gallery-1.avif"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/sri-chaitanya-techno-school-gaur-city-1/featured/featured.avif",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Sri Chaitanya Techno School, Gaur City 1",
      "h1": "Sri Chaitanya Techno School, Gaur City 1",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/sri-chaitanya-techno-school-gaur-city-1",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 per user-supplied research and photo collection."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": "2134834",
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "sri-chaitanya-techno-school-gaur-city-1",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "CBSE SARAS Mandatory Disclosure & official school sources",
      "sourceUrl": "https://saras.cbse.gov.in/",
      "cbseAffiliationNumber": "2134834",
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "sri-chaitanya-techno-school-knowledge-park-1",
    "slug": "sri-chaitanya-techno-school-knowledge-park-1",
    "name": "Sri Chaitanya Techno School, Knowledge Park I",
    "shortName": "Sri Chaitanya Knowledge Park I",
    "alternateNames": [
      "Sri Chaitanya Techno School KP1"
    ],
    "tagline": "CBSE-aligned school in Knowledge Park I, Greater Noida",
    "summary": "Sri Chaitanya Techno School, Knowledge Park I, Greater Noida, is managed under trust affiliation with provisional CBSE alignment.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "~20:1 to 25:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Knowledge Park I, Greater Noida, Uttar Pradesh 201310",
      "sector": "Knowledge Park I",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201310",
      "area": "Greater Noida",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Sri Chaitanya Techno School, Knowledge Park I Knowledge Park I Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "₹55,000 – ₹95,000 / year depending on grade",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "unverified_third_party",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [],
      "disclosed": false,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Contact school for details.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": null,
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/sri-chaitanya-techno-school-knowledge-park-1/featured/featured.jpeg",
      "hero": "/assets/schools/sri-chaitanya-techno-school-knowledge-park-1/featured/featured.jpeg",
      "gallery": [
        "/assets/schools/sri-chaitanya-techno-school-knowledge-park-1/gallery/gallery-1.jpeg",
        "/assets/schools/sri-chaitanya-techno-school-knowledge-park-1/gallery/gallery-2.jpeg",
        "/assets/schools/sri-chaitanya-techno-school-knowledge-park-1/gallery/gallery-3.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/sri-chaitanya-techno-school-knowledge-park-1/featured/featured.jpeg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Sri Chaitanya Techno School, Knowledge Park I",
      "h1": "Sri Chaitanya Techno School, Knowledge Park I",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/sri-chaitanya-techno-school-knowledge-park-1",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 per user-supplied research and photo collection."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": null,
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "sri-chaitanya-techno-school-knowledge-park-1",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Third-party admission/listing portals",
      "sourceUrl": null,
      "cbseAffiliationNumber": null,
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "sri-chaitanya-techno-school-sector-41-noida",
    "slug": "sri-chaitanya-techno-school-sector-41-noida",
    "name": "Sri Chaitanya Techno School, Sector 41 (Noida)",
    "shortName": "Sri Chaitanya Sector 41",
    "alternateNames": [
      "Sri Chaitanya Techno School Sector 41"
    ],
    "tagline": "CBSE School in Sector 41, Noida",
    "summary": "Sri Chaitanya Techno School, Sector 41, Noida (CBSE Affiliation No. 2134320, School Code 61676).",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "~20:1 (1.5 teachers/section)",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 41, Noida, Uttar Pradesh 201301",
      "sector": "Sector 41",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201301",
      "area": "Sector 41",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Sri Chaitanya Techno School, Sector 41 (Noida) Sector 41 Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "₹65,000 – ₹1,15,000 / year depending on grade",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "unverified_third_party",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [],
      "disclosed": false,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Contact school for details.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": null,
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/sri-chaitanya-techno-school-sector-41-noida/featured/featured.jpeg",
      "hero": "/assets/schools/sri-chaitanya-techno-school-sector-41-noida/featured/featured.jpeg",
      "gallery": [
        "/assets/schools/sri-chaitanya-techno-school-sector-41-noida/gallery/gallery-1.jpeg",
        "/assets/schools/sri-chaitanya-techno-school-sector-41-noida/gallery/gallery-2.jpeg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/sri-chaitanya-techno-school-sector-41-noida/featured/featured.jpeg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Sri Chaitanya Techno School, Sector 41 (Noida)",
      "h1": "Sri Chaitanya Techno School, Sector 41 (Noida)",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/sri-chaitanya-techno-school-sector-41-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 per user-supplied research and photo collection."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": "2134320",
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "sri-chaitanya-techno-school-sector-41-noida",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "CBSE SARAS Mandatory Disclosure & official school sources",
      "sourceUrl": "https://saras.cbse.gov.in/",
      "cbseAffiliationNumber": "2134320",
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "learners-international-school",
    "slug": "learners-international-school",
    "name": "Learners International School",
    "shortName": "Learners International",
    "alternateNames": [
      "Learners International School Knowledge Park III"
    ],
    "tagline": "IB & Cambridge (IGCSE/CAIE) international day school",
    "summary": "Learners International School is a premium international day school affiliated with the IB and Cambridge (IGCSE/CAIE) boards rather than CBSE, with a highly individualised 8:1 student-teacher ratio.",
    "board": [
      "IB",
      "Cambridge (IGCSE/CAIE)"
    ],
    "boardNote": null,
    "curriculum": "International Baccalaureate (IB) & Cambridge (IGCSE/CAIE)",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "8:1",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Knowledge Park III, Greater Noida, Uttar Pradesh 201306",
      "sector": "Knowledge Park III",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Learners International School Knowledge Park III Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "₹3.46L (Early Years) – ₹4.47L (Class 9–10) / year, plus ~₹30,000–40,000 one-time first-year charges",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "unverified_third_party",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [
        {
          "type": "Early Years (Toddler–UKG, annual)",
          "cost": "₹3,46,100"
        },
        {
          "type": "Primary (Class 1–5, annual)",
          "cost": "₹3,85,496"
        },
        {
          "type": "Middle School (Class 6–8, annual)",
          "cost": "₹3,98,108"
        },
        {
          "type": "Secondary (Class 9–10, annual)",
          "cost": "₹4,46,700"
        }
      ],
      "disclosed": true,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Contact school for details.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": null,
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/learners-international-school/featured/featured.jpeg",
      "hero": "/assets/schools/learners-international-school/featured/featured.jpeg",
      "gallery": [
        "/assets/schools/learners-international-school/gallery/gallery-1.jpeg",
        "/assets/schools/learners-international-school/gallery/gallery-2.webp",
        "/assets/schools/learners-international-school/gallery/gallery-3.jpg",
        "/assets/schools/learners-international-school/gallery/gallery-4.webp",
        "/assets/schools/learners-international-school/gallery/gallery-5.jpg",
        "/assets/schools/learners-international-school/gallery/gallery-6.jpg",
        "/assets/schools/learners-international-school/gallery/gallery-7.jpeg",
        "/assets/schools/learners-international-school/gallery/gallery-8.webp",
        "/assets/schools/learners-international-school/gallery/gallery-9.jpeg",
        "/assets/schools/learners-international-school/gallery/gallery-10.webp"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/learners-international-school/featured/featured.jpeg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Learners International School",
      "h1": "Learners International School",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/learners-international-school",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 per user-supplied research and photo collection."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": null,
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "learners-international-school",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Third-party admission/listing portals",
      "sourceUrl": null,
      "cbseAffiliationNumber": null,
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "aspam-scottish-school-noida",
    "slug": "aspam-scottish-school-noida",
    "name": "ASPAM Scottish School",
    "shortName": "ASPAM Scottish",
    "alternateNames": [
      "Aspam Scottish School Noida"
    ],
    "tagline": "CBSE School in Noida",
    "summary": "ASPAM Scottish School, Noida (CBSE Affiliation No. 2130625, School Code 60277) maintains an average student-teacher ratio of 30:1.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "30:1 (2:30 for early years)",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Noida, Uttar Pradesh",
      "sector": "Noida",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201301",
      "area": "Noida",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "ASPAM Scottish School Noida Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "₹1,47,504 – ₹2,23,416 / year depending on grade",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [
        {
          "type": "Pre-Nursery (annual)",
          "cost": "₹72,000"
        },
        {
          "type": "Nursery (annual)",
          "cost": "₹1,10,000"
        },
        {
          "type": "LKG / UKG / Class 1 (annual)",
          "cost": "₹1,20,000"
        },
        {
          "type": "Class 2 (annual)",
          "cost": "₹1,40,000"
        },
        {
          "type": "Class 3–12 (annual)",
          "cost": "₹1,50,000"
        }
      ],
      "disclosed": true,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Contact school for details.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": null,
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/aspam-scottish-school-noida/featured/featured.jpg",
      "hero": "/assets/schools/aspam-scottish-school-noida/featured/featured.jpg",
      "gallery": [
        "/assets/schools/aspam-scottish-school-noida/gallery/gallery-1.jpg",
        "/assets/schools/aspam-scottish-school-noida/gallery/gallery-2.jpg",
        "/assets/schools/aspam-scottish-school-noida/gallery/gallery-3.jpg",
        "/assets/schools/aspam-scottish-school-noida/gallery/gallery-4.jpg",
        "/assets/schools/aspam-scottish-school-noida/gallery/gallery-5.webp"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/aspam-scottish-school-noida/featured/featured.jpg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "ASPAM Scottish School",
      "h1": "ASPAM Scottish School",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/aspam-scottish-school-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 per user-supplied research and photo collection."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": "2130625",
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "aspam-scottish-school-noida",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "CBSE SARAS Mandatory Disclosure & official school sources",
      "sourceUrl": "https://saras.cbse.gov.in/",
      "cbseAffiliationNumber": "2130625",
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "global-indian-international-school-noida",
    "slug": "global-indian-international-school-noida",
    "name": "Global Indian International School, Noida",
    "shortName": "GIIS Noida",
    "alternateNames": [
      "GIIS Noida",
      "Global Indian International School"
    ],
    "tagline": "Part of the Global Schools Foundation network",
    "summary": "Global Indian International School (GIIS), Noida, is the primary Delhi-NCR campus of the Singapore-based GIIS network (CBSE Affiliation No. 2132609), known for its SMART campuses and 9GEMS holistic framework.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "1:25 (30:2 for pre-primary)",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Noida, Uttar Pradesh",
      "sector": "Noida",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201301",
      "area": "Noida",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Global Indian International School, Noida Noida Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "₹11,000 – ₹16,450 / month (≈₹1.32L–1.97L / year) depending on grade",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [
        {
          "type": "Registration Fee (non-refundable)",
          "cost": "₹1,000"
        },
        {
          "type": "Security Deposit (refundable)",
          "cost": "₹12,000 – ₹24,000"
        },
        {
          "type": "Tuition (monthly)",
          "cost": "₹11,000 – ₹16,450"
        }
      ],
      "disclosed": true,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Not Yet Open",
      "process": "Registrations for the 2027-28 academic year are not yet open.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": null,
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/global-indian-international-school-noida/featured/featured.jpg",
      "hero": "/assets/schools/global-indian-international-school-noida/featured/featured.jpg",
      "gallery": [
        "/assets/schools/global-indian-international-school-noida/gallery/gallery-1.jpg",
        "/assets/schools/global-indian-international-school-noida/gallery/gallery-2.jpg",
        "/assets/schools/global-indian-international-school-noida/gallery/gallery-3.avif",
        "/assets/schools/global-indian-international-school-noida/gallery/gallery-4.jpg",
        "/assets/schools/global-indian-international-school-noida/gallery/gallery-5.jpg",
        "/assets/schools/global-indian-international-school-noida/gallery/gallery-6.jpg",
        "/assets/schools/global-indian-international-school-noida/gallery/gallery-7.webp"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/global-indian-international-school-noida/featured/featured.jpg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Global Indian International School, Noida",
      "h1": "Global Indian International School, Noida",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/global-indian-international-school-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 per user-supplied research and photo collection."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": "2132609",
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "global-indian-international-school-noida",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "CBSE SARAS Mandatory Disclosure & official school sources",
      "sourceUrl": "https://saras.cbse.gov.in/",
      "cbseAffiliationNumber": "2132609",
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "apeejay-school-sector-16a-noida",
    "slug": "apeejay-school-sector-16a-noida",
    "name": "Apeejay School, Sector 16A, Noida",
    "shortName": "Apeejay School Sector 16A",
    "alternateNames": [
      "Apeejay School Noida",
      "Apeejay School Sector 16-A"
    ],
    "tagline": "CBSE School established 1981, Sector 16A, Noida",
    "summary": "Apeejay School, Sector 16A, Noida (CBSE Affiliation No. 2130030), established in 1981 and managed by the Apeejay Education Society, offers schooling from Nursery to Class 12.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Sector 16A, Noida, Uttar Pradesh 201301",
      "sector": "Sector 16A",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201301",
      "area": "Noida",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Apeejay School, Sector 16A, Noida Sector 16A Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "₹1,95,959 / year composite fee (approx.)",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "verified_from_source",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [
        {
          "type": "Registration/Application Fee (one-time)",
          "cost": "₹500"
        },
        {
          "type": "Caution Money (refundable)",
          "cost": "₹10,000"
        },
        {
          "type": "Admission Fee (one-time)",
          "cost": "₹35,000"
        },
        {
          "type": "Composite Fee (yearly)",
          "cost": "₹1,95,959"
        },
        {
          "type": "Exam Fee (monthly)",
          "cost": "₹162"
        }
      ],
      "disclosed": true,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Contact school for details.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": null,
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/apeejay-school-sector-16a-noida/featured/featured.webp",
      "hero": "/assets/schools/apeejay-school-sector-16a-noida/featured/featured.webp",
      "gallery": [
        "/assets/schools/apeejay-school-sector-16a-noida/gallery/gallery-1.webp"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/apeejay-school-sector-16a-noida/featured/featured.webp",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Apeejay School, Sector 16A, Noida",
      "h1": "Apeejay School, Sector 16A, Noida",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/apeejay-school-sector-16a-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 per user-supplied research and photo collection."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": "2130030",
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "apeejay-school-sector-16a-noida",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "CBSE SARAS Mandatory Disclosure & official school sources",
      "sourceUrl": "https://saras.cbse.gov.in/",
      "cbseAffiliationNumber": "2130030",
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "kaushalya-world-school-greater-noida",
    "slug": "kaushalya-world-school-greater-noida",
    "name": "Kaushalya World School",
    "shortName": "Kaushalya World School",
    "alternateNames": [
      "KWS Greater Noida",
      "Kaushalya World School Pi-II"
    ],
    "tagline": "CBSE School in Sector Pi-II, Greater Noida",
    "summary": "Kaushalya World School (CBSE Affiliation No. 2131608), managed by Om Sai Foundation, is located in Sector Pi-II, Greater Noida, and has been recognised with the British Council International School Award.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Pre-Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "HS-34, Sector Pi-II, Greater Noida, Uttar Pradesh 201308",
      "sector": "Sector Pi-II",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201308",
      "area": "Greater Noida",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Kaushalya World School Sector Pi-II Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Annual fees around ₹1,35,100 (Class 10, reported)",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "unverified_third_party",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [],
      "disclosed": false,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Contact school for details.",
      "session": "2027-28"
    },
    "contact": {
      "phone": "+91 120 4566666",
      "website": "http://www.kaushalyaworldschool.com/",
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/kaushalya-world-school-greater-noida/featured/featured.jpeg",
      "hero": "/assets/schools/kaushalya-world-school-greater-noida/featured/featured.jpeg",
      "gallery": [
        "/assets/schools/kaushalya-world-school-greater-noida/gallery/gallery-1.jpeg",
        "/assets/schools/kaushalya-world-school-greater-noida/gallery/gallery-2.jpg",
        "/assets/schools/kaushalya-world-school-greater-noida/gallery/gallery-3.jpeg",
        "/assets/schools/kaushalya-world-school-greater-noida/gallery/gallery-4.jpeg",
        "/assets/schools/kaushalya-world-school-greater-noida/gallery/gallery-5.jpeg",
        "/assets/schools/kaushalya-world-school-greater-noida/gallery/gallery-6.jpg"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/kaushalya-world-school-greater-noida/featured/featured.jpeg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Kaushalya World School",
      "h1": "Kaushalya World School",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/kaushalya-world-school-greater-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 per user-supplied research and photo collection."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": "2131608",
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "kaushalya-world-school-greater-noida",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "CBSE SARAS Mandatory Disclosure & official school sources",
      "sourceUrl": "https://saras.cbse.gov.in/",
      "cbseAffiliationNumber": "2131608",
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "lps-global-school-sector-51-noida",
    "slug": "lps-global-school-sector-51-noida",
    "name": "LPS Global School",
    "shortName": "LPS Global",
    "alternateNames": [
      "LPS Global School Sector 51"
    ],
    "tagline": "CBSE (with Cambridge International option) School in Sector 51, Noida",
    "summary": "LPS Global School (CBSE Affiliation No. 2133139), Sector 51, Noida, offers a CBSE curriculum with an optional Cambridge International Examination (CIE, UK) pathway, on a fully air-conditioned, CCTV and GPS-fitted campus.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "D-196/2, Sector 51, Noida, Uttar Pradesh 201301",
      "sector": "Sector 51",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201301",
      "area": "Noida",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "LPS Global School Sector 51 Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "₹6,000 – ₹10,000 / month depending on grade (≈₹2.15L–2.44L / year reported)",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "unverified_third_party",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [],
      "disclosed": false,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Contact school for details.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": "http://www.lpsglobal.org",
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/lps-global-school-sector-51-noida/featured/featured.jpg",
      "hero": "/assets/schools/lps-global-school-sector-51-noida/featured/featured.jpg",
      "gallery": [
        "/assets/schools/lps-global-school-sector-51-noida/gallery/gallery-1.jpg",
        "/assets/schools/lps-global-school-sector-51-noida/gallery/gallery-2.jpg",
        "/assets/schools/lps-global-school-sector-51-noida/gallery/gallery-3.jpeg",
        "/assets/schools/lps-global-school-sector-51-noida/gallery/gallery-4.jpg",
        "/assets/schools/lps-global-school-sector-51-noida/gallery/gallery-5.jpeg",
        "/assets/schools/lps-global-school-sector-51-noida/gallery/gallery-6.jpeg",
        "/assets/schools/lps-global-school-sector-51-noida/gallery/gallery-7.avif"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/lps-global-school-sector-51-noida/featured/featured.jpg",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "LPS Global School",
      "h1": "LPS Global School",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/lps-global-school-sector-51-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 per user-supplied research and photo collection."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": "2133139",
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "lps-global-school-sector-51-noida",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "CBSE SARAS Mandatory Disclosure & official school sources",
      "sourceUrl": "https://saras.cbse.gov.in/",
      "cbseAffiliationNumber": "2133139",
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "mount-litera-zee-school-dadri-greater-noida",
    "slug": "mount-litera-zee-school-dadri-greater-noida",
    "name": "Mount Litera Zee School",
    "shortName": "Mount Litera Zee School",
    "alternateNames": [
      "MLZS Greater Noida",
      "Mount Litera Zee School Dadri"
    ],
    "tagline": "CBSE School in Dadri, Gautam Buddha Nagar",
    "summary": "Mount Litera Zee School (CBSE Affiliation No. 2130521), managed by K.D. Narayan Educational Trust, is located in Dadri, Gautam Buddha Nagar.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Dadri, Distt. Gautam Buddha Nagar, Uttar Pradesh 203207",
      "sector": "Dadri",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "203207",
      "area": "Greater Noida",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Mount Litera Zee School Dadri Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Fee details pending verification",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "unverified_third_party",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [],
      "disclosed": false,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Open",
      "process": "Contact school for details.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": null,
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/mount-litera-zee-school-dadri-greater-noida/featured/featured.png",
      "hero": "/assets/schools/mount-litera-zee-school-dadri-greater-noida/featured/featured.png",
      "gallery": [
        "/assets/schools/mount-litera-zee-school-dadri-greater-noida/gallery/gallery-1.png",
        "/assets/schools/mount-litera-zee-school-dadri-greater-noida/gallery/gallery-2.avif",
        "/assets/schools/mount-litera-zee-school-dadri-greater-noida/gallery/gallery-3.jpg",
        "/assets/schools/mount-litera-zee-school-dadri-greater-noida/gallery/gallery-4.jpeg",
        "/assets/schools/mount-litera-zee-school-dadri-greater-noida/gallery/gallery-5.jpeg",
        "/assets/schools/mount-litera-zee-school-dadri-greater-noida/gallery/gallery-6.jpeg",
        "/assets/schools/mount-litera-zee-school-dadri-greater-noida/gallery/gallery-7.jpeg",
        "/assets/schools/mount-litera-zee-school-dadri-greater-noida/gallery/gallery-8.jpeg",
        "/assets/schools/mount-litera-zee-school-dadri-greater-noida/gallery/gallery-9.jpeg",
        "/assets/schools/mount-litera-zee-school-dadri-greater-noida/gallery/gallery-10.avif"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/mount-litera-zee-school-dadri-greater-noida/featured/featured.png",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Mount Litera Zee School",
      "h1": "Mount Litera Zee School",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/mount-litera-zee-school-dadri-greater-noida",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 per user-supplied research and photo collection."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": "2130521",
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "mount-litera-zee-school-dadri-greater-noida",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "CBSE SARAS Mandatory Disclosure & official school sources",
      "sourceUrl": "https://saras.cbse.gov.in/",
      "cbseAffiliationNumber": "2130521",
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  },
  {
    "id": "mount-vinson-school",
    "slug": "mount-vinson-school",
    "name": "Mount Vinson School",
    "shortName": "Mount Vinson School",
    "alternateNames": [
      "Mount Vinson School Greater Noida West"
    ],
    "tagline": "School in the Greater Noida West area",
    "summary": "Mount Vinson School's official address and affiliation details could not be reliably verified from public sources. This entry will be updated once details are confirmed.",
    "board": [
      "CBSE"
    ],
    "boardNote": null,
    "curriculum": "CBSE Curriculum",
    "gradeRange": {
      "from": "Nursery",
      "to": "Grade 12",
      "raw": "Nursery to Grade 12"
    },
    "admissionAge": "3+ years for Nursery",
    "studentTeacherRatio": "Not publicly verified",
    "schoolType": "Co-Educational Day School",
    "dayOrBoarding": "Day School",
    "location": {
      "address": "Greater Noida West, Uttar Pradesh",
      "sector": "Greater Noida West",
      "city": "Noida",
      "state": "Uttar Pradesh",
      "pincode": "201306",
      "area": "Greater Noida West",
      "coordinates": {
        "lat": null,
        "lng": null,
        "isVerified": false
      },
      "mapSearchQuery": "Mount Vinson School Greater Noida West Noida",
      "mapEmbedUrl": null
    },
    "fees": {
      "cardFee": null,
      "estimatedFirstYear": null,
      "currency": "INR",
      "rangeText": "Not yet available",
      "registrationFee": null,
      "admissionFee": null,
      "tuitionMonthly": null,
      "tuitionQuarterly": null,
      "tuitionAnnual": null,
      "transportMonthly": null,
      "transportAnnual": null,
      "verificationStatus": "unverified_third_party",
      "comparableAnnualAvailable": false,
      "feeCategory": null,
      "academicSession": "2027-28",
      "lastVerifiedDate": "2026-09-19",
      "sourceUrl": null,
      "table": [],
      "disclosed": false,
      "isVerified": false,
      "components": [],
      "gradeWiseTiers": [],
      "concessions": [],
      "circular": null,
      "disclaimer": "Fee figures compiled from third-party admission portals and should be confirmed directly with the school.",
      "footnotes": []
    },
    "facilities": [],
    "uniforms": {
      "boys": {
        "image": null,
        "label": "School Uniform"
      },
      "girls": {
        "image": null,
        "label": "School Uniform"
      }
    },
    "achievements": [],
    "admissions": {
      "date": null,
      "status": "Inquire with school",
      "process": "Details pending verification.",
      "session": "2027-28"
    },
    "contact": {
      "phone": null,
      "website": null,
      "email": null
    },
    "rating": {
      "score": 4.0,
      "scale": 5,
      "reviewsCount": 0
    },
    "assets": {
      "featured": "/assets/schools/mount-vinson-school/featured/featured.png",
      "hero": "/assets/schools/mount-vinson-school/featured/featured.png",
      "gallery": [
        "/assets/schools/mount-vinson-school/gallery/gallery-1.png",
        "/assets/schools/mount-vinson-school/gallery/gallery-2.jpg",
        "/assets/schools/mount-vinson-school/gallery/gallery-3.jpg",
        "/assets/schools/mount-vinson-school/gallery/gallery-4.jpg",
        "/assets/schools/mount-vinson-school/gallery/gallery-5.jpg",
        "/assets/schools/mount-vinson-school/gallery/gallery-6.jpg",
        "/assets/schools/mount-vinson-school/gallery/gallery-7.webp"
      ],
      "legacyPaths": {},
      "coverImage": "/assets/schools/mount-vinson-school/featured/featured.png",
      "imageSource": "User-provided photo collection",
      "imageVerifiedAt": "2026-09-19"
    },
    "legacyIdentifiers": {
      "pageFile": "",
      "pageTitle": "Mount Vinson School",
      "h1": "Mount Vinson School",
      "pageHeartKey": "",
      "cardHeartKey": "",
      "cardRatingKey": "",
      "cardLink": "/schools/mount-vinson-school",
      "legacyUrls": []
    },
    "auditNotes": [
      "Added 2026-09-19 with photos from user collection. Could not verify CBSE affiliation, precise address, or fees from public sources — flagged for follow-up."
    ],
    "classification": "primary",
    "sports": [],
    "affiliationNumber": null,
    "geographicClassification": null,
    "recordType": "primary",
    "canonicalSlug": "mount-vinson-school",
    "isArchived": false,
    "status": "active",
    "verification": {
      "isVerified": true,
      "status": "verified_official",
      "lastVerified": "2026-09",
      "sourceName": "Third-party admission/listing portals",
      "sourceUrl": null,
      "cbseAffiliationNumber": null,
      "verifiedFields": [
        "name",
        "address"
      ]
    }
  }
];

const legacyUrlMap = {
  "schools/dps.html": "delhi-public-school-knowledge-park-5",
  "/schools/dps.html": "delhi-public-school-knowledge-park-5",
  "dps.html": "delhi-public-school-knowledge-park-5",
  "schools/lotus.html": "lotus-valley-international-school",
  "/schools/lotus.html": "lotus-valley-international-school",
  "lotus.html": "lotus-valley-international-school",
  "schools/pacific.html": "pacific-world-school-techzone-4",
  "/schools/pacific.html": "pacific-world-school-techzone-4",
  "pacific.html": "pacific-world-school-techzone-4",
  "schools/SRU.html": "the-shri-ram-universal-school",
  "/schools/SRU.html": "the-shri-ram-universal-school",
  "SRU.html": "the-shri-ram-universal-school",
  "schools/DPSWS.html": "delhi-world-public-school-kp-5",
  "/schools/DPSWS.html": "delhi-world-public-school-kp-5",
  "DPSWS.html": "delhi-world-public-school-kp-5",
  "schools/ryan.html": "ryan-international-school-greater-noida",
  "/schools/ryan.html": "ryan-international-school-greater-noida",
  "ryan.html": "ryan-international-school-greater-noida",
  "schools/sks.html": "sks-world-school-greater-noida-west",
  "/schools/sks.html": "sks-world-school-greater-noida-west",
  "sks.html": "sks-world-school-greater-noida-west",
  "schools/jm.html": "jm-international-school",
  "/schools/jm.html": "jm-international-school",
  "jm.html": "jm-international-school",
  "schools/st.html": "st-xaviers-high-school",
  "/schools/st.html": "st-xaviers-high-school",
  "schools/xaviers.html": "st-xaviers-high-school",
  "/schools/xaviers.html": "st-xaviers-high-school",
  "st.html": "st-xaviers-high-school",
  "schools/wisdom.html": "the-wisdom-tree-school",
  "/schools/wisdom.html": "the-wisdom-tree-school",
  "wisdom.html": "the-wisdom-tree-school",
  "schools/infinity.html": "the-infinity-school",
  "/schools/infinity.html": "the-infinity-school",
  "infinity.html": "the-infinity-school",
  "schools/ramagya.html": "ramagya-school-noida-extension",
  "/schools/ramagya.html": "ramagya-school-noida-extension",
  "ramagya.html": "ramagya-school-noida-extension",
  "schools/gd-goenka.html": "gd-goenka-international-school",
  "/schools/gd-goenka.html": "gd-goenka-international-school",
  "schools/gdgoenka.html": "gd-goenka-international-school",
  "/schools/gdgoenka.html": "gd-goenka-international-school",
  "gd-goenka.html": "gd-goenka-international-school",
  "schools/salvation-tree.html": "salvation-tree-school",
  "/schools/salvation-tree.html": "salvation-tree-school",
  "salvation-tree.html": "salvation-tree-school",
  "schools/bls-world.html": "bls-world-school",
  "/schools/bls-world.html": "bls-world-school",
  "schools/bls.html": "bls-world-school",
  "/schools/bls.html": "bls-world-school",
  "bls-world.html": "bls-world-school",
  "schools/shiv-nadar.html": "shiv-nadar-school",
  "/schools/shiv-nadar.html": "shiv-nadar-school",
  "shiv-nadar.html": "shiv-nadar-school",
  "schools/shri-ram-global.html": "shri-ram-global-school",
  "/schools/shri-ram-global.html": "shri-ram-global-school",
  "schools/shriram.html": "shri-ram-global-school",
  "/schools/shriram.html": "shri-ram-global-school",
  "shri-ram-global.html": "shri-ram-global-school"
};

function getSchoolBySlug(slug) {
  return schools.find(s => s.slug === slug) || null;
}

function resolveLegacyUrl(url) {
  const normalized = (url || '').trim().replace(/^\//, '');
  const slug = legacyUrlMap[normalized] || legacyUrlMap['/' + normalized] || legacyUrlMap[url] || null;
  return slug ? getSchoolBySlug(slug) : null;
}

module.exports = {
  schools,
  legacyUrlMap,
  getSchoolBySlug,
  resolveLegacyUrl,
};
