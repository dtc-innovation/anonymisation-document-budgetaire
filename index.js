const ANONYMIZED_NAME = "Nom anonymisé";

// http://odm-budgetaire.org/doc-schema/CommunAnnexe_xsd_Complex_Type_ATCodNatJurBenef.html#ATCodNatJurBenef_V
const CodNatJurBenefPersonnesPhysiques = 'P3';

export default function(doc){
    const concours = Array.from(doc.getElementsByTagName('CONCOURS'));

    concours.forEach(c => {
        const natJurEl = c.getElementsByTagName('CodNatJurBenefCA')[0];
        
        if(natJurEl && natJurEl.getAttribute('V') === CodNatJurBenefPersonnesPhysiques){
            const libOrgaBenef = c.getElementsByTagName('LibOrgaBenef')[0];
            libOrgaBenef.setAttribute('V', ANONYMIZED_NAME);
        }
    })

}