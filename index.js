// http://odm-budgetaire.org/doc-schema/CommunAnnexe_xsd_Complex_Type_ATCodNatJurBenef.html#ATCodNatJurBenef_V
const CodNatJurBenefPersonnesPhysiques = 'P3';

export default function(doc, OCCULTATION_STRING = "Occultation Article L311-7 CRPA"){
    const concours = Array.from(doc.getElementsByTagName('CONCOURS'));
    concours.forEach(c => {
        const natJurEl = c.getElementsByTagName('CodNatJurBenefCA')[0];
        
        if(!natJurEl || natJurEl.getAttribute('V') === CodNatJurBenefPersonnesPhysiques){
            const libOrgaBenef = c.getElementsByTagName('LibOrgaBenef')[0];
            libOrgaBenef.setAttribute('V', OCCULTATION_STRING);
        }
    })

    const prets = Array.from(doc.getElementsByTagName('PRET'))
    prets.forEach(c => {
        const nomBenefPret = c.getElementsByTagName('NomBenefPret')[0];
        
        if(nomBenefPret){
            nomBenefPret.setAttribute('V', OCCULTATION_STRING);
        }
    })

    const BlocBudget = doc.getElementsByTagName('BlocBudget')[0];
    const PJRefs = Array.from(BlocBudget.getElementsByTagName('PJRef'));
    PJRefs.forEach(pjref => {
        const NomPJ = pjref.getElementsByTagName('NomPJ')[0];
        
        if(NomPJ){
            NomPJ.setAttribute('V', OCCULTATION_STRING);
        }
    })

    const Champ_Editeurs = Array.from(doc.getElementsByTagName('Champ_Editeur'));
    Champ_Editeurs.forEach(ce => {
        ce.setAttribute('V', OCCULTATION_STRING);
    })
}