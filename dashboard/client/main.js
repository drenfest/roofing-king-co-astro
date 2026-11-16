import { mount } from 'svelte';
import App from './App.svelte';

const target = document.getElementById('hud');
try {
  const response = await fetch('/hud/index.php?action=data', { credentials: 'same-origin', cache: 'no-store' });
  if (response.status === 401) location.replace('/hud/');
  if (!response.ok) throw new Error('The report could not be loaded. Please try again.');
  const data = await response.json();
  target.replaceChildren();
  mount(App, { target, props: { data } });
} catch (error) {
  target.textContent = error.message;
}
