import assert from 'node:assert/strict';
const booking='https://calendly.com/roofkingco-info/30-minute-roof-deck-inspection';
export function assertContactActions($,expected=2){
 assert.equal($('.rk-quote-form, #quote-form form, dialog.rk-native-quote-dialog form').length,0,'Unavailable quote forms must not be rendered.');
 assert.equal($('[data-contact-actions]').length,expected,'Inline and modal contact options remain available.');
 for(const action of $('[data-contact-actions]').toArray()){
  assert.equal($(action).find(`a[href="${booking}"]`).text().replace('→','').trim(),'Book an inspection');
  assert.equal($(action).find('a[href="tel:+16143798893"]').text().trim(),'Call (614) 379-8893');
  assert.equal($(action).find('input,select,textarea,button[type=submit]').length,0);
 }
 assert.equal($('#quote-dialog-title').text(),'Let’s talk about your project');
 assert.ok(!$('main').text().includes('Online quote requests are coming soon.'));
}
