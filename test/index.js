import {expect} from 'chai';

import {DOMParser, XMLSerializer} from 'xmldom';

import anonymize from '../index.js';


function makeDocBudg(annexes){
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
          <BlocBudget>
             <NatDec V="09"/>
             <Exer V="2016"/>
             <BudgPrec V="1"/>
             <ReprRes V="1"/>
             <NatFonc V="3"/>
             <CodTypBud V="P"/>
          </BlocBudget>
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

        expect( doc.getElementsByTagName('LibOrgaBenef')[0].getAttribute('V') ).to.not.equal(NAME);
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
        expect( libOrgaBenefs[0].getAttribute('V') ).to.not.equal( NAME_1 );
    })
    
    it('should not do anything if there is no <CodNatJurBenefCA> in the <CONCOURS>', () => {
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

        expect( doc.getElementsByTagName('LibOrgaBenef')[0].getAttribute('V') ).to.equal(NAME);
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

});
  
