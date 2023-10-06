// http://odm-budgetaire.org/doc-schema/CommunAnnexe_xsd_Complex_Type_ATCodNatJurBenef.html#ATCodNatJurBenef_V
const CodNatJurBenefPersonnesPhysiques = "P3";

export default function (
  doc,
  OCCULTATION_STRING = "Occultation Article L311-7 CRPA"
) {
  const provisions = Array.from(doc.getElementsByTagName("PROVISION"));
  provisions.forEach((c) => {
    const LibNatProv = c.getElementsByTagName("LibNatProv")[0];
    if (LibNatProv) {
      LibNatProv.setAttribute("V", OCCULTATION_STRING);
    }
    const LibObjProv = c.getElementsByTagName("LibObjProv")[0];
    if (LibObjProv) {
      LibObjProv.setAttribute("V", OCCULTATION_STRING);
    }
  });

  const personnels = Array.from(doc.getElementsByTagName("PERSONNEL"));
  personnels.forEach((c) => {
    const RemunAgent = c.getElementsByTagName("RemunAgent")[0];
    if (RemunAgent) {
      RemunAgent.setAttribute("V", OCCULTATION_STRING);
    }
  });

  const engagements = Array.from(doc.getElementsByTagName("ORGANISME_ENG"));
  engagements.forEach((c) => {
    const NomOrgEng = c.getElementsByTagName("NomOrgEng")[0];
    if (NomOrgEng) {
      NomOrgEng.setAttribute("V", OCCULTATION_STRING);
    }
    const RSOrgEng = c.getElementsByTagName("RSOrgEng")[0];
    if (RSOrgEng) {
      RSOrgEng.setAttribute("V", OCCULTATION_STRING);
    }
  });

  const concours = Array.from(doc.getElementsByTagName("CONCOURS"));
  concours.forEach((c) => {
    const CodNatJurBenefCA = c.getElementsByTagName("CodNatJurBenefCA")[0];

    if (
      !CodNatJurBenefCA ||
      CodNatJurBenefCA.getAttribute("V") === CodNatJurBenefPersonnesPhysiques
    ) {
      const LibOrgaBenef = c.getElementsByTagName("LibOrgaBenef")[0];
      if (LibOrgaBenef) {
        LibOrgaBenef.setAttribute("V", OCCULTATION_STRING);
      }
      const DenomOuNumSubv = c.getElementsByTagName("DenomOuNumSubv")[0];
      if (DenomOuNumSubv) {
        DenomOuNumSubv.setAttribute("V", OCCULTATION_STRING);
      }
      const LibPrestaNat = c.getElementsByTagName("LibPrestaNat")[0];
      if (LibPrestaNat) {
        LibPrestaNat.setAttribute("V", OCCULTATION_STRING);
      }
      const ObjSubv = c.getElementsByTagName("ObjSubv")[0];
      if (ObjSubv) {
        ObjSubv.setAttribute("V", OCCULTATION_STRING);
      }
    }
  });

  const prets = Array.from(doc.getElementsByTagName("PRET"));
  prets.forEach((c) => {
    const NomBenefPret = c.getElementsByTagName("NomBenefPret")[0];
    if (NomBenefPret) {
      NomBenefPret.setAttribute("V", OCCULTATION_STRING);
    }
  });

  const autresEngagements = Array.from(
    doc.getElementsByTagName("AUTRE_ENGAGEMENT")
  );
  autresEngagements.forEach((c) => {
    const CodTypPersoMorale = c.getElementsByTagName("CodTypPersoMorale")[0];

    if (CodTypPersoMorale.getAttribute("V") !== "U") {
      const NomOrgaBenef = c.getElementsByTagName("NomOrgaBenef")[0];
      if (NomOrgaBenef) {
        NomOrgaBenef.setAttribute("V", OCCULTATION_STRING);
      }
      const NatEng = c.getElementsByTagName("NatEng")[0];
      if (NatEng) {
        NatEng.setAttribute("V", OCCULTATION_STRING);
      }
    }
  });

  const credits_bails = Array.from(doc.getElementsByTagName("CREDIT_BAIL"));
  credits_bails.forEach((c) => {
    const LibCredBail = c.getElementsByTagName("LibCredBail")[0];
    if (LibCredBail) {
      LibCredBail.setAttribute("V", OCCULTATION_STRING);
    }
  });

  const dettes = Array.from(doc.getElementsByTagName("DETTE"));
  dettes.forEach((c) => {
    const LibTypDette = c.getElementsByTagName("LibTypDette")[0];
    if (LibTypDette) {
      LibTypDette.setAttribute("V", OCCULTATION_STRING);
    }
  });

  const BlocBudget = doc.getElementsByTagName("BlocBudget")[0];
  const PJRefs = Array.from(BlocBudget.getElementsByTagName("PJRef"));
  PJRefs.forEach((pjref) => {
    const NomPJ = pjref.getElementsByTagName("NomPJ")[0];
    if (NomPJ) {
      NomPJ.setAttribute("V", OCCULTATION_STRING);
    }
  });

  const Champ_Editeurs = Array.from(doc.getElementsByTagName("Champ_Editeur"));
  Champ_Editeurs.forEach((ce) => {
    ce.setAttribute("V", OCCULTATION_STRING);
  });

  const MEMBREASAs = Array.from(doc.getElementsByTagName("MEMBREASA"));
  MEMBREASAs.forEach((masa) => {
    const Proprietaire = masa.getElementsByTagName("Proprietaire")[0];
    if (Proprietaire) {
      Proprietaire.setAttribute("V", OCCULTATION_STRING);
    }
  });
}
