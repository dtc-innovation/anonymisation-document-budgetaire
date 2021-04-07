import {expect} from 'chai';

import {DOMParser, XMLSerializer} from 'xmldom';

import anonymize from '../index.js';

const defaultBlocBudget = `<BlocBudget>
    <NatDec V="09"/>
    <Exer V="2016"/>
    <BudgPrec V="1"/>
    <ReprRes V="1"/>
    <NatFonc V="3"/>
    <CodTypBud V="P"/>
</BlocBudget>`


function makeDocBudg(annexes = '', blocBudget = defaultBlocBudget){
    const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
    <DocumentBudgetaire xsi:schemaLocation="http://www.minefi.gouv.fr/cp/demat/docbudgetaire Actes_budgetaires___Schema_Annexes_Bull_V15\DocumentBudgetaire.xsd" xmlns="http://www.minefi.gouv.fr/cp/demat/docbudgetaire" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
       <VersionSchema V="81"/>
       <EnTeteDocBudgetaire>
          <DteStr V="2017-12-03"/>
          <LibellePoste V="Test LibellePoste"/>
          <IdPost V="Test"/>
          <LibelleColl V="Collectivité test, genre Mours"/>
          <NatCEPL V="Nature colletivité test"/>
       </EnTeteDocBudgetaire>
       <Budget>
          <EnTeteBudget>
             <LibelleEtab V="Budget test"/>
             <CodColl V="000"/>
             <CodBud V="00"/>
             <Nomenclature V="M14-M14_COM_500_3500"/>
          </EnTeteBudget>
          ${blocBudget}
          <InformationsGenerales/>
          <LigneBudget>
            <CodRD V="D"/>
            <OpBudg V="0"/>
            <MtReal V="1"/>
          </LigneBudget>
          ${annexes}
        </Budget>
    </DocumentBudgetaire>`;

    return (new DOMParser()).parseFromString(xmlStr, "text/xml");
}

describe('anonymize', () => {
    
    it('should be a function', () => {
        expect(anonymize).to.be.a('function');
    });

    it('should do nothing if there is no annexes', () => {
        const annexes = '';
        const doc = makeDocBudg(annexes);
        
        anonymize(doc);

        expect(doc.getElementsByTagName('Annexes')).to.have.length(0);
    })
    
    it('should anonymize the document if there is one physical person name', () => {
        const NAME = "David Bruant";
        
        const annexes = `<Annexes>
            <DATA_CONCOURS>
                <CONCOURS>
                    <CodNatJurBenefCA V="P3"/>
                    <LibOrgaBenef V="${NAME}"/>
                    <MtSubv V="1000000"/>
                </CONCOURS>
            </DATA_CONCOURS>
        </Annexes>`;

        const doc = makeDocBudg(annexes);
        
        anonymize(doc);

        expect( (new XMLSerializer()).serializeToString(doc) ).to.not.include(NAME);
    })
    
    it('should anonymize the document if there are several physical person names', () => {
        const NAME_1 = "David Bruant";
        const NAME_2 = "Jean-Michel Bouquetin";
        
        const annexes = `<Annexes>
            <DATA_CONCOURS>
                <CONCOURS>
                    <CodNatJurBenefCA V="P3"/>
                    <LibOrgaBenef V="${NAME_1}"/>
                    <MtSubv V="1000000"/>
                </CONCOURS>
                <CONCOURS>
                    <CodNatJurBenefCA V="P3"/>
                    <LibOrgaBenef V="${NAME_2}"/>
                    <MtSubv V="1000000"/>
                </CONCOURS>
            </DATA_CONCOURS>
        </Annexes>`;

        const doc = makeDocBudg(annexes);

        anonymize(doc);
        
        const libOrgaBenefs = doc.getElementsByTagName('LibOrgaBenef');

        expect( libOrgaBenefs[0].getAttribute('V') ).to.equal( libOrgaBenefs[1].getAttribute('V') );
        expect( (new XMLSerializer()).serializeToString(doc) ).to.not.include(NAME_1);
    })
    
    it('should anonymize if there is no <CodNatJurBenefCA> in the <CONCOURS>', () => {
        const NAME = "Asso dtc";
        
        const annexes = `<Annexes>
            <DATA_CONCOURS>
                <CONCOURS>
                    <LibOrgaBenef V="${NAME}"/>
                    <MtSubv V="1000000"/>
                </CONCOURS>
            </DATA_CONCOURS>
        </Annexes>`;

        const doc = makeDocBudg(annexes);
        
        anonymize(doc);

        expect( (new XMLSerializer()).serializeToString(doc) ).to.not.include(NAME);
    })
    
    it('should not do anything if there are subs, but no physical person', () => {
        const annexes = `<Annexes>
            <DATA_CONCOURS>
                <CONCOURS>
                    <CodNatJurBenefCA V="P1"/>
                    <LibOrgaBenef V="P1"/>
                    <MtSubv V="1000000"/>
                </CONCOURS>
                <CONCOURS>
                    <CodNatJurBenefCA V="P2"/>
                    <LibOrgaBenef V="P2"/>
                    <MtSubv V="1000000"/>
                </CONCOURS>
                <CONCOURS>
                    <CodNatJurBenefCA V="U1"/>
                    <LibOrgaBenef V="U1"/>
                    <MtSubv V="1000000"/>
                </CONCOURS>
                <CONCOURS>
                    <CodNatJurBenefCA V="U2"/>
                    <LibOrgaBenef V="U2"/>
                    <MtSubv V="1000000"/>
                </CONCOURS>
                <CONCOURS>
                    <CodNatJurBenefCA V="U3"/>
                    <LibOrgaBenef V="U3"/>
                    <MtSubv V="1000000"/>
                </CONCOURS>
                <CONCOURS>
                    <CodNatJurBenefCA V="U4"/>
                    <LibOrgaBenef V="U4"/>
                    <MtSubv V="1000000"/>
                </CONCOURS>
                <CONCOURS>
                    <CodNatJurBenefCA V="U5"/>
                    <LibOrgaBenef V="U5"/>
                    <MtSubv V="1000000"/>
                </CONCOURS>
                <CONCOURS>
                    <CodNatJurBenefCA V="U6"/>
                    <LibOrgaBenef V="U6"/>
                    <MtSubv V="1000000"/>
                </CONCOURS>
            </DATA_CONCOURS>
        </Annexes>`;

        const doc = makeDocBudg(annexes);
        
        anonymize(doc);
        const concours = Array.from(doc.getElementsByTagName('CONCOURS'));

        concours.forEach(c => {
            const natJur = c.getElementsByTagName('CodNatJurBenefCA')[0];
            const orgaBenef = c.getElementsByTagName('LibOrgaBenef')[0];
            
            expect(natJur.getAttribute('V')).to.equal(orgaBenef.getAttribute('V'))
        })

    })

    it(`should anonymize all <NomBenefPret>s in all <PRET>s`, () => {
        const NAME = 'David Bruant';
        
        const annexes = `<Annexes>
            <DATA_PRET>
                <PRET>
                    <CodTypPret V="N"/>
                    <NomBenefPret V="${NAME}"/>
                    <DtDelib V="2017-12-10"/>
                    <MtCapitalRestDu_31_12 V="12"/>
                    <MtCapitalExer V="0.0"/>
                    <MtIntExer V="0.0"/>
                </PRET>
            </DATA_PRET>
        </Annexes>`;

        const doc = makeDocBudg(annexes);
        
        anonymize(doc);

        expect( (new XMLSerializer()).serializeToString(doc) ).to.not.include(NAME);
    })

    
    it('should occult all Budget > BlocBudget > PJRef > NomPJ[V]', () => {
        const PJ_NAME_1 = "Yo.pdf";
        const PJ_NAME_2 = "Document joint";
        
        const blocBudget = `<BlocBudget>
            <NatDec V="09"/>
            <Exer V="2016"/>
            <BudgPrec V="1"/>
            <ReprRes V="1"/>
            <NatFonc V="3"/>
            <CodTypBud V="P"/>
            <PJRef>
                <NomPJ V="${PJ_NAME_1}"/>
            </PJRef>
            <PJRef>
                <NomPJ V="${PJ_NAME_2}"/>
            </PJRef>
        </BlocBudget>`

        const doc = makeDocBudg(undefined, blocBudget);
        
        anonymize(doc);

        expect( (new XMLSerializer()).serializeToString(doc) ).to.not.include(PJ_NAME_1);
        expect( (new XMLSerializer()).serializeToString(doc) ).to.not.include(PJ_NAME_2);
    })

    
    it('should occult all Champ_Editeur[V]', () => {
        const CHAMP_EDITEUR_1 = "srbdtyndu,yu";
        const CHAMP_EDITEUR_2 = "16151651681653";
        const CHAMP_EDITEUR_3 = "ù$*ù*ù$";
        
        const annexes = `<Annexes>
            <DATA_EMPRUNT>
                <EMPRUNT>
                    <Champ_Editeur V="${CHAMP_EDITEUR_1}"/>
                </EMPRUNT>
            </DATA_EMPRUNT>
            <DATA_TRESORERIE>
                <TRESORERIE>
                    <Champ_Editeur V="${CHAMP_EDITEUR_2}"/>
                </TRESORERIE>
            </DATA_TRESORERIE>
            <DATA_CHARGE>
                <CHARGE>
                    <Champ_Editeur V="${CHAMP_EDITEUR_3}"/>
                </CHARGE>
            </DATA_CHARGE>
        </Annexes>`;

        const doc = makeDocBudg(annexes);
        
        anonymize(doc);

        expect( (new XMLSerializer()).serializeToString(doc) ).to.not.include(CHAMP_EDITEUR_1);
        expect( (new XMLSerializer()).serializeToString(doc) ).to.not.include(CHAMP_EDITEUR_2);
        expect( (new XMLSerializer()).serializeToString(doc) ).to.not.include(CHAMP_EDITEUR_3);
    })

    it(`should anonymize all <Proprietaire>s in all <MEMBREASA>s`, () => {
        const NAME = 'David Bruant';
        
        const annexes = `<Annexes>
            <DATA_MEMBRESASA>
                <MEMBREASA>
                    <Proprietaire V="${NAME}"/>
                </MEMBREASA>
            </DATA_MEMBRESASA>
        </Annexes>`;

        const doc = makeDocBudg(annexes);
        
        anonymize(doc);

        expect( (new XMLSerializer()).serializeToString(doc) ).to.not.include(NAME);
    })

});
  
