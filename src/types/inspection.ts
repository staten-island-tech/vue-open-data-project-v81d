export type Inspection = {
  entityid: string;
  schoolname: string;
  number: string;
  street: string;
  city: string;
  state: string;
  borough: string;
  zipcode: string;
  lastinspection: string; // floating timestamp
  permittee: string;
  inspectiondate: string; // floating timestamp
  ptet: string;
  site_type: string;
  level: string;
  code: string;
  violationdescription: string;
  latitude: string; // number
  longitude: string; // number
  communityboard: string;
  councildistrict: string;
  censustract: string;
  bin: string;
  bbl: string;
  nta: string;
  borocode: string; // number
};
