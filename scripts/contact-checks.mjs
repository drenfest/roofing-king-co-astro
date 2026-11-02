import assert from 'node:assert/strict';
import site from '../src/data/site.json' with {type:'json'};
const booking='https://calendly.com/roofkingco-info/30-minute-roof-deck-inspection';
export function assertContactActions($,expected=2){
 assert.equal($('form.rk-quote-form[data-form-mode="preview"]').length,expected,'Shared preview forms render inline and in the dialog.');
 for(const form of $('form.rk-quote-form').toArray()){
  const preview=$(form);assert.equal(preview.attr('method'),'dialog');assert.ok(!preview.attr('action'),'Preview must not post to an endpoint.');
  assert.equal(preview.find('input[required]').length,4);assert.equal(preview.find('select[required]').length,1);
  assert.equal(preview.find('button[type=submit]:disabled').length,0);assert.ok(preview.find('[role=status]').text().includes('not sent'));
 }
 assert.equal($('[data-contact-actions]').length,$('form[data-contact-options="included"]').length,'Inline and modal contact options remain available.');
 for(const action of $('[data-contact-actions]').toArray()){
  assert.equal($(action).find(`a[href="${booking}"]`).text().replace('→','').trim(),'Book an inspection');
  assert.equal($(action).find(`a[href="${site.phoneHref}"]`).text().trim(),'Call '+site.phone);
  assert.equal($(action).find('input,select,textarea,button[type=submit]').length,0);
 }
 assert.equal($('#quote-dialog-title').text(),'Get a free quote');
 assert.ok(!$('main').text().includes('Online quote requests are coming soon.'));
}
