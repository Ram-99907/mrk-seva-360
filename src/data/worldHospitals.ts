import type { Hospital } from '../types';

const IMG = [
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop',
];

function h(
  id: string, name: string, type: 'government'|'private', category: string,
  address: string, city: string, district: string, state: string,
  lat: number, lng: number, specialties: string[], beds: number, est: number,
  rating: number, reviews: number, desc: string, imgIdx: number
): Hospital {
  return {
    id, name, type, category: category as any, address, city, district, state,
    pincode: '000000', phone: '+00-0000000000', email: `info@${name.toLowerCase().replace(/[^a-z]/g,'')}.demo`,
    website: '#', openingHours: '24/7 Emergency | OPD: Mon–Sat 09:00–17:00',
    opdTimings: '9:00 AM – 5:00 PM', opdFee: type === 'government' ? 'Free' : 200,
    specialties, services: ['OPD','IPD','ICU','Emergency','Pharmacy','Radiology','Lab'],
    departments: specialties, insuranceSchemes: type === 'government' ? ['Government Insurance'] : ['Private Insurance'],
    bedCount: beds, bedsAvailable: Math.floor(beds*0.15), icuBeds: Math.floor(beds*0.08),
    ambulances: Math.max(2, Math.floor(beds/100)), emergencyAvailable: true,
    bookingAvailable: true, isHfrVerified: true, nhsEmrCode: `HFR-${id}`,
    established: est, rating, reviewCount: reviews, lat, lng,
    image: IMG[imgIdx % IMG.length], description: desc,
    dataSource: 'Demo Registry', lastUpdated: '2026-10-01',
  };
}

export const WORLD_HOSPITALS: Hospital[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // INDIA — ANDHRA PRADESH
  // ═══════════════════════════════════════════════════════════════════════════
  h('w001','Apollo Hospitals Visakhapatnam','private','multi-specialty','Waltair Main Rd, Visakhapatnam','Visakhapatnam','Visakhapatnam','Andhra Pradesh',17.7231,83.3013,['Cardiology','Neurology','Oncology','Orthopaedics'],500,1988,4.6,1820,'Apollo Hospitals Visakhapatnam is a leading multi-specialty hospital on the east coast.',0),
  h('w002','King George Hospital','government','teaching','Maharanipeta, Visakhapatnam','Visakhapatnam','Visakhapatnam','Andhra Pradesh',17.7148,83.3037,['General Medicine','General Surgery','Paediatrics','Gynaecology'],1200,1845,4.3,2100,'KGH is the oldest and largest government teaching hospital in Visakhapatnam.',1),
  h('w003','NRI General Hospital','private','multi-specialty','Chinakakani, Guntur','Guntur','Guntur','Andhra Pradesh',16.3067,80.4365,['Cardiology','Nephrology','Gastroenterology','Neurology'],800,1998,4.5,1450,'NRI Hospital is a premier tertiary care hospital in Guntur district.',2),
  h('w004','Government General Hospital Guntur','government','teaching','Kanna Vari Thota, Guntur','Guntur','Guntur','Andhra Pradesh',16.3005,80.4443,['General Medicine','Surgery','Orthopaedics','ENT'],1000,1863,4.1,1800,'GGH Guntur is a major government teaching hospital serving the region.',3),
  h('w005','SVIMS Tirupati','government','teaching','Alipiri Rd, Tirupati','Tirupati','Tirupati','Andhra Pradesh',13.6288,79.4192,['Cardiology','Neurology','Nephrology','Gastroenterology'],1200,1993,4.5,2200,'SVIMS is a premier super-specialty institution in Tirupati.',4),
  h('w006','Narayana Medical College Nellore','private','teaching','Chinthareddypalem, Nellore','Nellore','Nellore','Andhra Pradesh',14.4426,79.9865,['Cardiology','Neurology','Orthopaedics','Paediatrics'],700,2001,4.3,1100,'Narayana Medical College provides comprehensive tertiary healthcare.',5),
  h('w007','Government General Hospital Anantapur','government','district','Anantapur Town','Anantapur','Anantapur','Andhra Pradesh',14.6819,77.6006,['General Medicine','Surgery','Gynaecology','Paediatrics'],500,1950,4.0,980,'GGH Anantapur serves as the primary district hospital.',6),
  h('w008','Manipal Hospital Vijayawada','private','multi-specialty','Tadepalli, Vijayawada','Vijayawada','Krishna','Andhra Pradesh',16.5062,80.6480,['Cardiology','Oncology','Orthopaedics','Neurology'],450,2005,4.6,1350,'Manipal Hospital offers world-class healthcare in the capital region.',7),

  // ═══════════════════════════════════════════════════════════════════════════
  // INDIA — TELANGANA
  // ═══════════════════════════════════════════════════════════════════════════
  h('w009','Osmania General Hospital','government','teaching','Afzalgunj, Hyderabad','Hyderabad','Hyderabad','Telangana',17.3753,78.4744,['General Medicine','Surgery','Orthopaedics','ENT'],1168,1919,4.2,2400,'Osmania is one of the largest government hospitals in South India.',8),
  h('w010','NIMS Hyderabad','government','teaching','Punjagutta, Hyderabad','Hyderabad','Hyderabad','Telangana',17.4256,78.4466,['Cardiology','Neurology','Nephrology','Gastroenterology'],1500,1966,4.5,2800,'Nizam\'s Institute of Medical Sciences is a premier super-specialty hospital.',9),
  h('w011','MGM Hospital Warangal','government','teaching','Warangal','Warangal','Warangal','Telangana',17.9784,79.5941,['General Medicine','Surgery','Paediatrics','Gynaecology'],800,1959,4.1,1500,'MGM Hospital is the largest government hospital in Warangal.',0),
  h('w012','Continental Hospitals','private','multi-specialty','Gachibowli, Hyderabad','Hyderabad','Hyderabad','Telangana',17.4400,78.3489,['Cardiology','Oncology','Neurology','Transplants'],750,2013,4.7,1200,'Continental Hospitals is a JCI accredited multi-specialty hospital.',1),

  // ═══════════════════════════════════════════════════════════════════════════
  // INDIA — TAMIL NADU
  // ═══════════════════════════════════════════════════════════════════════════
  h('w013','CMC Vellore','private','teaching','Ida Scudder Rd, Vellore','Vellore','Vellore','Tamil Nadu',12.9249,79.1325,['Cardiology','Neurology','Oncology','Haematology'],2700,1900,4.9,5200,'Christian Medical College Vellore is one of India\'s most prestigious hospitals.',2),
  h('w014','JIPMER Puducherry','government','teaching','Dhanvantari Nagar, Puducherry','Puducherry','Puducherry','Puducherry',11.9570,79.7957,['General Medicine','Surgery','Dermatology','Psychiatry'],2200,1956,4.7,3800,'JIPMER is a premier medical institution of national importance.',3),
  h('w015','Apollo Hospitals Chennai','private','multi-specialty','Greams Rd, Chennai','Chennai','Chennai','Tamil Nadu',13.0604,80.2505,['Cardiology','Oncology','Transplants','Neurology'],700,1983,4.7,3100,'Apollo Chennai is the flagship hospital of the Apollo group.',4),
  h('w016','Madurai Meenakshi Mission Hospital','private','multi-specialty','Lake Area, Madurai','Madurai','Madurai','Tamil Nadu',9.9252,78.1198,['Cardiology','Orthopaedics','Neurology','Urology'],600,1985,4.5,1800,'Meenakshi Mission is a leading multi-specialty hospital in South Tamil Nadu.',5),
  h('w017','PSG Hospitals Coimbatore','private','teaching','Peelamedu, Coimbatore','Coimbatore','Coimbatore','Tamil Nadu',11.0240,77.0293,['Cardiology','Gastroenterology','Orthopaedics','Nephrology'],800,1985,4.6,2000,'PSG Hospitals provides tertiary care integrated with medical education.',6),
  h('w018','Government Rajaji Hospital Madurai','government','teaching','Panagal Rd, Madurai','Madurai','Madurai','Tamil Nadu',9.9190,78.1173,['General Medicine','Surgery','Paediatrics','Gynaecology'],2700,1842,4.2,2600,'GRH Madurai is a major government teaching hospital serving southern TN.',7),

  // ═══════════════════════════════════════════════════════════════════════════
  // INDIA — KARNATAKA
  // ═══════════════════════════════════════════════════════════════════════════
  h('w019','Narayana Health City','private','multi-specialty','Bommasandra, Bengaluru','Bengaluru','Bengaluru Urban','Karnataka',12.8089,77.6971,['Cardiology','Cardiac Surgery','Oncology','Neurology'],3000,2001,4.7,4500,'Narayana Health City is one of the largest cardiac care centres globally.',8),
  h('w020','NIMHANS Bengaluru','government','teaching','Hosur Rd, Bengaluru','Bengaluru','Bengaluru Urban','Karnataka',12.9417,77.5946,['Neurology','Psychiatry','Neurosurgery','Psychology'],700,1974,4.8,3200,'NIMHANS is India\'s premier mental health and neuroscience institution.',9),
  h('w021','KMC Hospital Mangaluru','private','teaching','Ambedkar Circle, Mangaluru','Mangaluru','Dakshina Kannada','Karnataka',12.8706,74.8428,['General Medicine','Surgery','Paediatrics','Dermatology'],1500,1953,4.5,2100,'Kasturba Medical College Hospital is a renowned teaching hospital.',0),
  h('w022','JSS Hospital Mysuru','private','teaching','MG Rd, Mysuru','Mysuru','Mysuru','Karnataka',12.3051,76.6551,['Cardiology','Orthopaedics','Neurology','Gastroenterology'],1200,1984,4.4,1800,'JSS Hospital is a leading multi-specialty teaching hospital in Mysuru.',1),

  // ═══════════════════════════════════════════════════════════════════════════
  // INDIA — KERALA
  // ═══════════════════════════════════════════════════════════════════════════
  h('w023','Amrita Hospital Kochi','private','teaching','Ponekkara, Kochi','Kochi','Ernakulam','Kerala',10.0358,76.2985,['Cardiology','Oncology','Transplants','Gastroenterology'],1350,1998,4.7,2800,'Amrita Institute is one of India\'s leading tertiary care teaching hospitals.',2),
  h('w024','Medical College Trivandrum','government','teaching','Chalakkuzhi, Thiruvananthapuram','Thiruvananthapuram','Thiruvananthapuram','Kerala',8.5132,76.9472,['General Medicine','Surgery','Dermatology','Psychiatry'],3000,1951,4.4,3500,'Government Medical College Trivandrum is Kerala\'s premier teaching hospital.',3),
  h('w025','IQRAA Hospital Kozhikode','private','multi-specialty','Pottammal, Kozhikode','Kozhikode','Kozhikode','Kerala',11.2488,75.7738,['Cardiology','Neurology','Orthopaedics','Urology'],300,2006,4.5,950,'IQRAA provides quality multi-specialty healthcare in Malabar region.',4),
  h('w026','Jubilee Mission Hospital Thrissur','private','multi-specialty','East Fort, Thrissur','Thrissur','Thrissur','Kerala',10.5276,76.2144,['Cardiology','Oncology','Neurology','Nephrology'],600,1951,4.6,1600,'Jubilee Mission is a leading hospital in central Kerala.',5),

  // ═══════════════════════════════════════════════════════════════════════════
  // INDIA — MAHARASHTRA
  // ═══════════════════════════════════════════════════════════════════════════
  h('w027','Tata Memorial Hospital','government','specialty-clinic','Parel, Mumbai','Mumbai','Mumbai City','Maharashtra',19.0048,72.8430,['Oncology','Radiation Oncology','Surgical Oncology'],629,1941,4.8,4500,'Tata Memorial is India\'s premier cancer treatment and research centre.',6),
  h('w028','KEM Hospital Mumbai','government','teaching','Parel, Mumbai','Mumbai','Mumbai City','Maharashtra',19.0001,72.8410,['General Medicine','Surgery','Orthopaedics','Paediatrics'],1800,1926,4.4,3200,'KEM is one of Mumbai\'s largest and oldest government teaching hospitals.',7),
  h('w029','Ruby Hall Clinic Pune','private','multi-specialty','Sassoon Rd, Pune','Pune','Pune','Maharashtra',18.5279,73.8818,['Cardiology','Neurology','Transplants','Oncology'],750,1959,4.6,2200,'Ruby Hall Clinic is Pune\'s first and largest private multi-specialty hospital.',8),
  h('w030','Government Medical College Nagpur','government','teaching','Hanuman Nagar, Nagpur','Nagpur','Nagpur','Maharashtra',21.1565,79.0699,['General Medicine','Surgery','Orthopaedics','ENT'],2000,1947,4.2,2800,'GMC Nagpur is a premier teaching hospital in central India.',9),
  h('w031','Wockhardt Hospital Nashik','private','multi-specialty','Nashik Rd','Nashik','Nashik','Maharashtra',19.9975,73.7898,['Cardiology','Orthopaedics','Neurology','Gastroenterology'],300,2008,4.4,800,'Wockhardt provides advanced multi-specialty care in Nashik.',0),

  // ═══════════════════════════════════════════════════════════════════════════
  // INDIA — DELHI NCR
  // ═══════════════════════════════════════════════════════════════════════════
  h('w032','Safdarjung Hospital','government','teaching','Ring Rd, New Delhi','New Delhi','New Delhi','Delhi',28.5685,77.2084,['General Medicine','Surgery','Burns','Plastic Surgery'],1600,1942,4.3,3000,'Safdarjung is one of the largest government hospitals in Delhi.',1),
  h('w033','Medanta The Medicity','private','multi-specialty','Sector 38, Gurugram','Gurugram','Gurugram','Haryana',28.4389,77.0422,['Cardiology','Neurology','Oncology','Transplants'],1600,2009,4.7,3500,'Medanta is a world-class multi-super-specialty hospital.',2),
  h('w034','Fortis Hospital Noida','private','multi-specialty','Sector 62, Noida','Noida','Gautam Buddha Nagar','Uttar Pradesh',28.6277,77.3649,['Cardiology','Orthopaedics','Oncology','Urology'],300,2010,4.5,1400,'Fortis Noida provides comprehensive multi-specialty healthcare.',3),
  h('w035','Max Super Specialty Saket','private','multi-specialty','Saket, New Delhi','New Delhi','South Delhi','Delhi',28.5272,77.2138,['Cardiology','Neurology','Oncology','Gastroenterology'],500,2006,4.6,2100,'Max Saket is a leading super-specialty hospital in South Delhi.',4),

  // ═══════════════════════════════════════════════════════════════════════════
  // INDIA — UTTAR PRADESH
  // ═══════════════════════════════════════════════════════════════════════════
  h('w036','KGMU Lucknow','government','teaching','Shah Mina Rd, Lucknow','Lucknow','Lucknow','Uttar Pradesh',26.8598,80.9280,['General Medicine','Surgery','Paediatrics','Gynaecology'],4500,1905,4.4,3800,'KGMU is one of the oldest and most prestigious medical universities.',5),
  h('w037','BHU Hospital Varanasi','government','teaching','Lanka, Varanasi','Varanasi','Varanasi','Uttar Pradesh',25.2677,82.9913,['Cardiology','Neurology','Ayurveda','General Medicine'],2500,1916,4.5,3200,'BHU\'s Sir Sunderlal Hospital is a major teaching hospital.',6),
  h('w038','SN Medical College Agra','government','teaching','Hospital Rd, Agra','Agra','Agra','Uttar Pradesh',27.1827,78.0081,['General Medicine','Surgery','Orthopaedics','ENT'],2200,1854,4.1,2400,'SN Medical College is one of the oldest medical institutions in UP.',7),

  // ═══════════════════════════════════════════════════════════════════════════
  // INDIA — RAJASTHAN, WEST BENGAL, GUJARAT, PUNJAB, OTHERS
  // ═══════════════════════════════════════════════════════════════════════════
  h('w039','SMS Hospital Jaipur','government','teaching','JLN Marg, Jaipur','Jaipur','Jaipur','Rajasthan',26.9025,75.8059,['General Medicine','Surgery','Orthopaedics','Burns'],2500,1947,4.3,3200,'SMS Hospital is the largest government hospital in Rajasthan.',8),
  h('w040','AIIMS Jodhpur','government','teaching','Basni, Jodhpur','Jodhpur','Jodhpur','Rajasthan',26.2577,73.0483,['Cardiology','Neurology','Nephrology','Gastroenterology'],750,2012,4.6,1800,'AIIMS Jodhpur provides premier healthcare in western Rajasthan.',9),
  h('w041','SSKM Hospital Kolkata','government','teaching','AJC Bose Rd, Kolkata','Kolkata','Kolkata','West Bengal',22.5413,88.3450,['General Medicine','Surgery','Cardiology','Neurology'],2500,1945,4.3,3500,'SSKM is the largest government hospital in eastern India.',0),
  h('w042','Civil Hospital Ahmedabad','government','teaching','Asarwa, Ahmedabad','Ahmedabad','Ahmedabad','Gujarat',23.0507,72.6003,['General Medicine','Surgery','Orthopaedics','ENT'],2300,1879,4.2,2800,'Civil Hospital is Gujarat\'s largest government teaching hospital.',1),
  h('w043','Sterling Hospital Vadodara','private','multi-specialty','Racecourse Rd, Vadodara','Vadodara','Vadodara','Gujarat',22.3180,73.1926,['Cardiology','Orthopaedics','Neurology','Oncology'],300,2001,4.5,1100,'Sterling Hospital provides premium multi-specialty care.',2),
  h('w044','PGI Chandigarh','government','teaching','Sector 12, Chandigarh','Chandigarh','Chandigarh','Chandigarh',30.7632,76.7749,['Cardiology','Neurology','Nephrology','Hepatology'],2000,1962,4.7,4200,'PGIMER is one of India\'s most prestigious medical institutions.',3),
  h('w045','DMC Ludhiana','private','teaching','Tagore Nagar, Ludhiana','Ludhiana','Ludhiana','Punjab',30.9183,75.8573,['General Medicine','Surgery','Orthopaedics','Paediatrics'],600,1894,4.4,1500,'Dayanand Medical College is a leading teaching hospital in Punjab.',4),
  h('w046','AIIMS Bhubaneswar','government','teaching','Sijua, Bhubaneswar','Bhubaneswar','Khordha','Odisha',20.2506,85.8028,['Cardiology','Neurology','Gastroenterology','Oncology'],800,2012,4.6,1900,'AIIMS Bhubaneswar provides advanced healthcare in Odisha.',5),
  h('w047','AIIMS Patna','government','teaching','Phulwari Sharif, Patna','Patna','Patna','Bihar',25.5886,85.0996,['Cardiology','Neurology','Gastroenterology','Surgery'],750,2012,4.5,1700,'AIIMS Patna serves as a major healthcare facility for Bihar.',6),
  h('w048','AIIMS Bhopal','government','teaching','Saket Nagar, Bhopal','Bhopal','Bhopal','Madhya Pradesh',23.2065,77.4688,['Cardiology','Neurology','Orthopaedics','Oncology'],750,2012,4.5,1600,'AIIMS Bhopal is a premier institution of national importance.',7),
  h('w049','Choithram Hospital Indore','private','multi-specialty','Manik Bagh Rd, Indore','Indore','Indore','Madhya Pradesh',22.6938,75.8560,['Cardiology','Gastroenterology','Urology','Neurology'],400,1972,4.4,1200,'Choithram Hospital is a leading charitable multi-specialty hospital.',8),
  h('w050','RIMS Ranchi','government','teaching','Bariatu, Ranchi','Ranchi','Ranchi','Jharkhand',23.3700,85.3246,['General Medicine','Surgery','Paediatrics','Gynaecology'],1500,1960,4.2,2100,'RIMS Ranchi is the premier government hospital in Jharkhand.',9),
  h('w051','GMCH Guwahati','government','teaching','Bhangagarh, Guwahati','Guwahati','Kamrup Metropolitan','Assam',26.1781,91.7567,['General Medicine','Surgery','Paediatrics','ENT'],1300,1960,4.2,2200,'GMCH is the largest government hospital in northeast India.',0),
  h('w052','Goa Medical College','government','teaching','Bambolim, Panaji','Panaji','North Goa','Goa',15.4624,73.8736,['General Medicine','Surgery','Orthopaedics','Dermatology'],900,1963,4.3,1400,'GMC Goa is the primary government medical institution in Goa.',1),
  h('w053','Fortis Hospital Udaipur','private','multi-specialty','Bedla Rd, Udaipur','Udaipur','Udaipur','Rajasthan',24.5607,73.6958,['Cardiology','Neurology','Orthopaedics','Urology'],200,2012,4.5,600,'Fortis Udaipur provides quality super-specialty care in Mewar region.',2),

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL — USA
  // ═══════════════════════════════════════════════════════════════════════════
  h('w054','Mayo Clinic','private','multi-specialty','200 First St SW, Rochester','New York','New York','USA',40.7580,-73.9855,['Cardiology','Oncology','Neurology','Transplants','Endocrinology'],4000,1889,4.9,8500,'Mayo Clinic is consistently ranked as the #1 hospital in the United States.',3),
  h('w055','Cleveland Clinic','private','multi-specialty','9500 Euclid Ave, Cleveland','New York','New York','USA',40.7489,-73.9680,['Cardiology','Cardiac Surgery','Urology','Rheumatology'],1400,1921,4.9,7200,'Cleveland Clinic is a world-renowned academic medical center.',4),
  h('w056','Johns Hopkins Hospital','private','teaching','1800 Orleans St, Baltimore','New York','New York','USA',40.7128,-74.0060,['Neurology','Oncology','Psychiatry','Ophthalmology'],1100,1889,4.8,6800,'Johns Hopkins has been at the forefront of medical discovery for over a century.',5),
  h('w057','Cedars-Sinai Medical Center','private','multi-specialty','8700 Beverly Blvd, LA','Los Angeles','Los Angeles','USA',34.0749,-118.3802,['Cardiology','Neurology','Gastroenterology','Orthopaedics'],900,1902,4.7,4200,'Cedars-Sinai is the largest non-profit hospital in Western USA.',6),
  h('w058','UCLA Medical Center','government','teaching','757 Westwood Plaza, LA','Los Angeles','Los Angeles','USA',34.0661,-118.4462,['Oncology','Neurology','Transplants','Psychiatry'],500,1955,4.8,3900,'UCLA Medical Center is a top-ranked academic medical center.',7),
  h('w059','MD Anderson Cancer Center','government','specialty-clinic','1515 Holcombe Blvd, Houston','Houston','Harris County','USA',29.7078,-95.3977,['Oncology','Radiation Oncology','Surgical Oncology','Immunotherapy'],650,1941,4.9,5600,'MD Anderson is the world\'s leading cancer treatment and research center.',8),
  h('w060','Northwestern Memorial Hospital','private','teaching','251 E Huron St, Chicago','Chicago','Cook County','USA',41.8950,-87.6215,['Cardiology','Transplants','Neurology','Gastroenterology'],900,1972,4.7,3400,'Northwestern Memorial is a leading academic medical center in the Midwest.',9),

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL — UK
  // ═══════════════════════════════════════════════════════════════════════════
  h('w061','Great Ormond Street Hospital','government','specialty-clinic','Great Ormond St, London','London','Greater London','United Kingdom',51.5226,-0.1200,['Paediatrics','Paediatric Surgery','Genetics','Oncology'],415,1852,4.8,4100,'GOSH is a world-leading children\'s hospital.',0),
  h('w062','St Thomas Hospital','government','teaching','Westminster Bridge Rd, London','London','Greater London','United Kingdom',51.4987,-0.1173,['General Medicine','Emergency','Cardiology','Nephrology'],840,1173,4.6,3200,'St Thomas\' is one of the oldest NHS teaching hospitals.',1),
  h('w063','Royal Infirmary Manchester','government','teaching','Oxford Rd, Manchester','Manchester','Greater Manchester','United Kingdom',53.4609,-2.2271,['Cardiology','Transplants','Emergency','Oncology'],900,1752,4.5,2800,'Manchester Royal Infirmary is a major NHS teaching hospital.',2),
  h('w064','Queen Elizabeth Hospital Birmingham','government','teaching','Mindelsohn Way, Birmingham','Birmingham','West Midlands','United Kingdom',52.4538,-1.9387,['Trauma','Burns','Oncology','Renal'],1213,2010,4.6,2600,'QEHB is one of the largest single-site hospitals in the UK.',3),

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL — UAE
  // ═══════════════════════════════════════════════════════════════════════════
  h('w065','Cleveland Clinic Abu Dhabi','private','multi-specialty','Al Maryah Island, Abu Dhabi','Abu Dhabi','Abu Dhabi','UAE',24.5008,54.3942,['Cardiology','Neurology','Oncology','Transplants'],364,2015,4.8,2200,'Cleveland Clinic Abu Dhabi brings world-class healthcare to the Gulf.',4),
  h('w066','Mediclinic City Hospital Dubai','private','multi-specialty','Dubai Healthcare City','Dubai','Dubai','UAE',25.2280,55.3208,['Cardiology','Oncology','Orthopaedics','IVF'],280,2008,4.6,1800,'Mediclinic is a leading multi-specialty hospital in Dubai.',5),
  h('w067','Rashid Hospital Dubai','government','general','Oud Metha, Dubai','Dubai','Dubai','UAE',25.2337,55.3141,['Emergency','Trauma','Burns','General Surgery'],700,1973,4.4,2100,'Rashid Hospital is a major DHA government hospital specializing in trauma.',6),

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL — SINGAPORE, THAILAND, JAPAN, SOUTH KOREA
  // ═══════════════════════════════════════════════════════════════════════════
  h('w068','Singapore General Hospital','government','teaching','Outram Rd, Singapore','Singapore','Central Region','Singapore',1.2800,103.8353,['Cardiology','Oncology','Transplants','Neurology'],1800,1821,4.8,4500,'SGH is the largest and oldest hospital in Singapore.',7),
  h('w069','Mount Elizabeth Hospital','private','multi-specialty','3 Mount Elizabeth, Singapore','Singapore','Central Region','Singapore',1.3060,103.8350,['Cardiology','Oncology','Orthopaedics','Neurology'],345,1979,4.7,2800,'Mount Elizabeth is a premier private hospital in Asia.',8),
  h('w070','Bumrungrad International Hospital','private','multi-specialty','33 Sukhumvit 3, Bangkok','Bangkok','Bangkok','Thailand',13.7467,100.5563,['Cardiology','Oncology','Orthopaedics','Cosmetic Surgery'],580,1980,4.7,3600,'Bumrungrad serves over 1.1 million patients annually from 190 countries.',9),
  h('w071','University of Tokyo Hospital','government','teaching','7-3-1 Hongo, Tokyo','Tokyo','Tokyo','Japan',35.7124,139.7648,['Oncology','Neurology','Transplants','Genetics'],1200,1858,4.8,3800,'UTokyo Hospital is Japan\'s most prestigious medical institution.',0),
  h('w072','Samsung Medical Center','private','teaching','81 Irwon-ro, Seoul','Seoul','Gangnam','South Korea',37.4881,127.0857,['Oncology','Cardiology','Neurology','Transplants'],1979,1994,4.8,4200,'Samsung Medical Center is a top-ranked hospital in South Korea.',1),
  h('w073','Seoul National University Hospital','government','teaching','101 Daehak-ro, Seoul','Seoul','Jongno','South Korea',37.5793,126.9990,['Cardiology','Neurology','Oncology','Transplants'],1700,1978,4.8,5100,'SNUH is South Korea\'s leading national university hospital.',2),

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNATIONAL — GERMANY, CANADA, AUSTRALIA, SAUDI ARABIA
  // ═══════════════════════════════════════════════════════════════════════════
  h('w074','Charité Berlin','government','teaching','Charitéplatz 1, Berlin','Berlin','Berlin','Germany',52.5260,13.3777,['Cardiology','Neurology','Oncology','Transplants'],3000,1710,4.8,4800,'Charité is one of Europe\'s largest and most prestigious university hospitals.',3),
  h('w075','Klinikum der Universität München','government','teaching','Marchioninistr, Munich','Munich','Bavaria','Germany',48.1092,11.4694,['Cardiology','Transplants','Oncology','Neurology'],2100,1813,4.7,3600,'LMU Klinikum is a world-renowned university hospital.',4),
  h('w076','Toronto General Hospital','government','teaching','200 Elizabeth St, Toronto','Toronto','Ontario','Canada',43.6590,-79.3884,['Transplants','Cardiology','Neurology','Oncology'],471,1819,4.8,3900,'UHN Toronto General is ranked among the world\'s best hospitals.',5),
  h('w077','Vancouver General Hospital','government','teaching','899 W 12th Ave, Vancouver','Vancouver','British Columbia','Canada',49.2608,-123.1230,['Trauma','Neurology','Cardiology','Oncology'],600,1906,4.6,2800,'VGH is the largest hospital in British Columbia.',6),
  h('w078','Royal Prince Alfred Hospital','government','teaching','Missenden Rd, Sydney','Sydney','New South Wales','Australia',-33.8879,151.1810,['Cardiology','Transplants','Oncology','Neurology'],900,1882,4.7,3200,'RPA is one of Australia\'s most respected teaching hospitals.',7),
  h('w079','Royal Melbourne Hospital','government','teaching','300 Grattan St, Melbourne','Melbourne','Victoria','Australia',-37.7990,144.9559,['Neurology','Oncology','Trauma','Cardiology'],650,1848,4.7,3000,'Royal Melbourne is a leading public teaching hospital.',8),
  h('w080','King Faisal Specialist Hospital','government','specialty-clinic','Al Mathar Ash Shamali, Riyadh','Riyadh','Riyadh','Saudi Arabia',24.6674,46.6776,['Oncology','Transplants','Cardiology','Genetics'],1200,1975,4.7,3500,'KFSH&RC is Saudi Arabia\'s premier tertiary referral hospital.',9),
];

export const WORLD_CITIES = Array.from(new Set(WORLD_HOSPITALS.map(h => h.city))).sort();
