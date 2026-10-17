(function () {
  'use strict';

  // ---- desktop dropdown nav (click + hover, keyboard accessible) ----
  var items = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));
  function closeAll(except) {
    items.forEach(function (it) {
      if (it === except) return;
      it.setAttribute('data-open', 'false');
      it.setAttribute('data-pinned', 'false');
      var b = it.querySelector('button.nav-link');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  items.forEach(function (it) {
    var btn = it.querySelector('button.nav-link');
    if (!btn) return;
    var hoverTimer;
    // Click PINS the menu open. Without this flag, moving the mouse to the
    // button fires mouseenter (which opens it), and the click then reads it
    // as already-open and closes it again - the menu appears not to work.
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var pinned = it.getAttribute('data-pinned') === 'true';
      closeAll(it);
      if (pinned) {
        it.setAttribute('data-pinned', 'false');
        it.setAttribute('data-open', 'false');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        it.setAttribute('data-pinned', 'true');
        it.setAttribute('data-open', 'true');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
    it.addEventListener('mouseenter', function () {
      clearTimeout(hoverTimer);
      closeAll(it);
      it.setAttribute('data-open', 'true');
      btn.setAttribute('aria-expanded', 'true');
    });
    it.addEventListener('mouseleave', function () {
      if (it.getAttribute('data-pinned') === 'true') return;
      hoverTimer = setTimeout(function () {
        it.setAttribute('data-open', 'false');
        btn.setAttribute('aria-expanded', 'false');
      }, 130);
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) closeAll(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAll(null);
      var b = document.querySelector('.burger[aria-expanded="true"]');
      if (b) b.click();
    }
  });

  // ---- mobile menu ----
  var burger = document.querySelector('.burger');
  var mnav = document.getElementById('mnav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      burger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      mnav.classList.toggle('open', !open);
      document.body.style.overflow = open ? '' : 'hidden';
    });
    mnav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        burger.setAttribute('aria-expanded', 'false');
        mnav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ---- forms ----
  Array.prototype.forEach.call(document.querySelectorAll('form.jsform'), function (form) {
    var status = form.querySelector('.formstatus');
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // honeypot
      if (form.elements['company_website'] && form.elements['company_website'].value) return;

      var missing = [];
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (f) {
        if (!f.value.trim()) missing.push(f);
      });
      var email = form.elements['email'];
      if (email && email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email.value)) missing.push(email);
      var phone = form.elements['phone'];
      if (phone && phone.value && phone.value.replace(/\D/g, '').length < 10) missing.push(phone);

      if (missing.length) {
        status.className = 'formstatus err';
        status.textContent = 'Please check the highlighted fields and try again.';
        missing[0].focus();
        missing.forEach(function (f) { f.style.borderColor = '#D64545'; });
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';
      status.className = 'formstatus';

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.pageUrl = location.pathname;

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (r) { if (!r.ok) throw new Error('bad status'); return r.json().catch(function(){return {};}); })
        .then(function () {
          form.reset();
          status.className = 'formstatus ok';
          status.textContent = 'Got it. We will call you to confirm a time, usually the same business day.';
        })
        .catch(function () {
          status.className = 'formstatus err';
          status.innerHTML = 'That did not go through. Please call us at <a href="tel:+16143798893"><strong>(614) 379-8893</strong></a> and we will take care of it.';
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = label;
        });
    });

    form.addEventListener('input', function (e) {
      if (e.target.style) e.target.style.borderColor = '';
    });
  });

  // ---- exit-intent offer ----
  // Desktop: the pointer leaving through the top of the window is the only
  // reliable "about to leave" signal. Touch devices have no equivalent, so
  // they get depth plus dwell instead, which is the honest substitute.
  // Shown at most once a week per visitor, never twice in a session.
  (function () {
    var modal = document.getElementById('exitoffer');
    if (!modal) return;

    var KEY = 'rk_exitoffer_seen';
    var WEEK = 7 * 24 * 60 * 60 * 1000;
    var shown = false;
    var lastFocus = null;

    function seenRecently() {
      try {
        var t = parseInt(window.localStorage.getItem(KEY), 10);
        return t && Date.now() - t < WEEK;
      } catch (e) { return false; }      // private mode, blocked storage
    }
    function remember() {
      try { window.localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
    }
    if (seenRecently()) return;

    function focusables() {
      return Array.prototype.slice.call(
        modal.querySelectorAll('a[href],button:not([disabled])')
      ).filter(function (el) { return el.offsetParent !== null; });
    }

    function open() {
      if (shown || modal.hidden === false) return;
      // somebody with the help panel open is engaged, not leaving
      var help = document.getElementById('helppanel');
      if (help && !help.hidden) return;
      shown = true;
      remember();
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      var f = focusables();
      if (f.length) f[0].focus();   // the close button, first in the card, not the CTA
      document.addEventListener('keydown', onKey, true);
    }

    function close() {
      modal.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey, true);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function onKey(e) {
      if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) { e.preventDefault(); close(); }
    });

    var touch = window.matchMedia && window.matchMedia('(hover: none)').matches;

    if (touch) {
      var landed = Date.now();
      window.addEventListener('scroll', function () {
        if (shown) return;
        var h = document.documentElement;
        var depth = (h.scrollTop + window.innerHeight) / h.scrollHeight;
        if (depth > 0.6 && Date.now() - landed > 20000) open();
      }, { passive: true });
    } else {
      document.addEventListener('mouseout', function (e) {
        if (shown || e.relatedTarget || e.clientY > 6) return;
        open();
      });
    }
  })();

  // ---- storm history lookup ----
  (function () {
    var form = document.getElementById('stormform');
    if (!form) return;
    var out = document.getElementById('stormresult');
    var status = form.querySelector('.formstatus');
    var input = document.getElementById('storm-addr');
    var btn = form.querySelector('button[type="submit"]');

    function esc(v) {
      return String(v).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function usDate(iso) {
      var p = iso.split('-');
      var months = ['January','February','March','April','May','June','July',
                    'August','September','October','November','December'];
      return months[parseInt(p[1], 10) - 1] + ' ' + parseInt(p[2], 10) + ', ' + p[0];
    }

    function render(d) {
      var rows = d.events.map(function (e) {
        var what = e.type === 'hail'
          ? (e.hailInches ? e.hailInches.toFixed(2) + '&Prime; hail' : 'Hail')
          : e.type === 'wind'
            ? (e.windMph ? e.windMph + ' mph wind' : 'Damaging wind')
            : 'Tornado';
        return '<tr><td>' + esc(usDate(e.date)) + '</td><td>' + what +
               '</td><td>' + e.miles + ' mi</td><td>' + esc(e.county) + ' County</td></tr>';
      }).join('');

      var head;
      if (!d.events.length) {
        head = '<p class="storm-lead">No storm events are on record within ' + d.within.area +
               ' miles of <strong>' + esc(d.address) + '</strong> between ' +
               usDate(d.coverage.from) + ' and ' + usDate(d.coverage.to) + '.</p>';
      } else {
        var bits = [];
        if (d.biggestHail && d.biggestHail.hailInches) {
          bits.push('the largest reported hail was <strong>' + d.biggestHail.hailInches.toFixed(2) +
                    '&Prime;</strong> on ' + usDate(d.biggestHail.date) +
                    ', ' + d.biggestHail.miles + ' miles away');
        }
        if (d.strongestWind && d.strongestWind.windMph) {
          bits.push('the strongest reported wind was <strong>' + d.strongestWind.windMph +
                    ' mph</strong> on ' + usDate(d.strongestWind.date));
        }
        head = '<p class="storm-lead"><strong>' + d.counts.hail + '</strong> hail and <strong>' +
               d.counts.wind + '</strong> wind events are on record within ' + d.within.area +
               ' miles of <strong>' + esc(d.address) + '</strong> since ' +
               d.coverage.from.slice(0, 4) + '. ' +
               (d.counts.nearTotal ? d.counts.nearTotal + ' of them were within ' +
                 d.within.near + ' miles. ' : '') +
               (bits.length ? bits.join(', and ') + '.' : '') + '</p>';
      }

      out.innerHTML =
        '<h2>Storm history</h2>' + head +
        (d.events.length
          ? '<div class="tablewrap"><table class="stormtable"><thead><tr><th>Date</th><th>Event</th>' +
            '<th>Distance</th><th>County</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
          : '') +
        '<p class="storm-caveat">' + esc(d.caveat) + '</p>' +
        '<p class="storm-src">Source: ' + esc(d.source) + '. Address matched by the US Census Bureau geocoder.</p>' +
        '<div class="btn-row storm-cta">' +
          '<a class="btn btn-quote btn-lg" href="/free-inspection/">Have Someone Look At It</a>' +
          '<a class="btn btn-ghost btn-lg" href="tel:+16143798893">(614) 379-8893</a>' +
        '</div>';
      out.hidden = false;
    }

    var MESSAGES = {
      address_too_short: 'Please enter a full street address, including the city or ZIP.',
      address_not_found: 'We could not match that address. Try it without the unit number, or use the ZIP code.',
      outside_coverage: 'This tool covers Ohio addresses. Call us and we will pull the history for you.',
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var address = input.value.trim();
      if (address.length < 8) {
        status.className = 'formstatus err';
        status.textContent = MESSAGES.address_too_short;
        input.focus();
        return;
      }

      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Checking…';
      status.className = 'formstatus';
      status.textContent = '';
      out.hidden = true;

      fetch('/api/storm-report/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address }),
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            return { ok: r.ok, body: j };
          });
        })
        .then(function (r) {
          if (!r.ok) {
            status.className = 'formstatus err';
            status.textContent = MESSAGES[r.body.error] ||
              'That did not go through. Call us at (614) 379-8893 and we will pull it for you.';
            return;
          }
          render(r.body);
          out.setAttribute('tabindex', '-1');
          out.focus();
        })
        .catch(function () {
          status.className = 'formstatus err';
          status.innerHTML = 'That did not go through. Please call us at ' +
            '<a href="tel:+16143798893"><strong>(614) 379-8893</strong></a>.';
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = label;
        });
    });
  })();

  // ---- help panel ----
  // Retrieval over the answers already published on the site. It never
  // composes a sentence of its own: everything shown is a stored answer plus
  // a link to the page it came from, so nothing can be said here that is not
  // also said, in the same words, somewhere a customer can check.
  (function () {
    var launch = document.getElementById('helplaunch');
    var panel = document.getElementById('helppanel');
    if (!launch || !panel) return;

    var closeBtn = document.getElementById('helpclose');
    var input = document.getElementById('help-q');
    var chips = document.getElementById('help-chips');
    var results = document.getElementById('help-results');

    var CHIPS = ['Hail damage', 'What does a roof cost', 'Insurance claim',
                 'Financing', 'Warranty', 'How long does it take'];
    var STOP = { the:1, a:1, an:1, is:1, are:1, do:1, does:1, my:1, i:1, to:1,
                 of:1, in:1, on:1, for:1, and:1, it:1, you:1, we:1, what:1,
                 how:1, can:1, will:1, with:1, me:1, be:1 };

    var data = null;
    var loading = null;

    function words(v) {
      return String(v).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
        .filter(function (w) { return w.length > 2 && !STOP[w]; });
    }

    function load() {
      if (data) return Promise.resolve(data);
      if (loading) return loading;
      // Resolved from this script's own src rather than hard coded, so the
      // panel also works when the site is served from a subpath.
      var base = (function () {
        var el = document.querySelector('script[src$="site.js"]');
        return el ? el.getAttribute('src').replace(/site\.js$/, '') : '/assets/';
      })();
      loading = fetch(base + 'answers.json')
        .then(function (r) { return r.json(); })
        .then(function (j) {
          data = j.entries.map(function (e) {
            return { q: e.q, a: e.a, url: e.url, qw: words(e.q), aw: words(e.a) };
          });
          return data;
        })
        .catch(function () { data = []; return data; });
      return loading;
    }

    function esc(v) {
      return String(v).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function score(entry, qw, raw) {
      var n = 0;
      for (var i = 0; i < qw.length; i++) {
        var w = qw[i];
        for (var j = 0; j < entry.qw.length; j++) {
          if (entry.qw[j] === w) { n += 4; break; }
          if (entry.qw[j].indexOf(w) === 0 || w.indexOf(entry.qw[j]) === 0) { n += 2; break; }
        }
        for (var k = 0; k < entry.aw.length; k++) {
          if (entry.aw[k] === w) { n += 1; break; }
        }
      }
      if (raw.length > 4 && entry.q.toLowerCase().indexOf(raw) !== -1) n += 6;
      return n;
    }

    function show(list) {
      if (!list.length) {
        results.innerHTML =
          '<p class="help-none">Nothing on the site covers that one yet. ' +
          'Call the office at <a href="tel:+16143798893"><strong>(614) 379-8893</strong></a> ' +
          'and somebody will answer it properly, or book an inspection below and ask on site.</p>';
        return;
      }
      results.innerHTML = list.map(function (e, i) {
        return '<details class="help-a"' + (i === 0 ? ' open' : '') + '>' +
          '<summary>' + esc(e.q) + '</summary>' +
          '<p>' + esc(e.a) + '</p>' +
          '<a class="help-src" href="' + esc(e.url) + '">Read this on the ' +
          (e.url === '/' ? 'home page' : esc(e.url.replace(/\//g, '')) + ' page') + '</a>' +
          '</details>';
      }).join('');
    }

    function search(raw) {
      var q = String(raw || '').trim().toLowerCase();
      load().then(function (all) {
        if (!q) { show(all.slice(0, 4)); return; }
        var qw = words(q);
        if (!qw.length) { show(all.slice(0, 4)); return; }
        var ranked = all.map(function (e) { return { e: e, s: score(e, qw, q) }; })
          .filter(function (r) { return r.s > 2; })
          .sort(function (a, b2) { return b2.s - a.s; })
          .slice(0, 4)
          .map(function (r) { return r.e; });
        show(ranked);
      });
    }

    CHIPS.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'help-chip';
      btn.textContent = c;
      btn.addEventListener('click', function () { input.value = c; search(c); input.focus(); });
      chips.appendChild(btn);
    });

    var typing;
    input.addEventListener('input', function () {
      clearTimeout(typing);
      typing = setTimeout(function () { search(input.value); }, 180);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); clearTimeout(typing); search(input.value); }
    });

    function openPanel() {
      panel.hidden = false;
      launch.setAttribute('aria-expanded', 'true');
      search('');
      input.focus();
      document.addEventListener('keydown', onKey, true);
    }
    function closePanel() {
      panel.hidden = true;
      launch.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', onKey, true);
      launch.focus();
    }
    function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); closePanel(); } }

    launch.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);
  })();
  // ---- booking calendar ----
  // Any link to the inspection page, or anything marked data-book, opens the
  // calendar in place. The link still works without JavaScript.
  (function () {
    var modal = document.getElementById('booker');
    if (!modal) return;
    var grid = modal.querySelector('.cal-grid');
    var monthEl = modal.querySelector('.cal-month');
    var slotsBox = modal.querySelector('.slots');
    var slotList = modal.querySelector('.slot-list');
    var slotsDay = modal.querySelector('.slots-day');
    var form = document.getElementById('bookform');
    var status = form.querySelector('.formstatus');
    var steps = modal.querySelectorAll('.book-step');
    // Arrival times the office will keep. Mon to Fri 10:00 to 6:30,
    // Saturday 10:00 to 6:00, Sunday 1:00 to 4:00. Thursday 1:00 PM is an
    // internal block and is never offered.
    var WEEKDAY = ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM'];
    var SATURDAY = ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:00 PM'];
    var SUNDAY = ['1:00 PM', '2:30 PM'];
    var BLOCKED = { 4: ['1:00 PM'] };
    function slotsFor(d) {
      var day = d.getDay();
      var list = day === 0 ? SUNDAY : day === 6 ? SATURDAY : WEEKDAY;
      var hide = BLOCKED[day] || [];
      return list.filter(function (t) { return hide.indexOf(t) === -1; });
    }
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var MAX_DAYS = 45;
    var lastFocus = null;
    var picked = { date: null, time: null };

    function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
    var first = startOfDay(new Date()); first.setDate(first.getDate() + 1);   // tomorrow
    var last = new Date(first); last.setDate(last.getDate() + MAX_DAYS);
    var view = new Date(first.getFullYear(), first.getMonth(), 1);

    function iso(d) {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    function nice(d) { return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getDate(); }
    function openDay(d) { return d >= first && d <= last; }

    function show(n) {
      Array.prototype.forEach.call(steps, function (s) { s.hidden = s.getAttribute('data-step') !== String(n); });
      modal.querySelector('#book-h').textContent = n === 1 ? 'Pick a day and time' : n === 2 ? 'Where should we come?' : 'All set';
    }

    function render() {
      monthEl.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
      var prev = modal.querySelector('[data-cal="-1"]');
      var next = modal.querySelector('[data-cal="1"]');
      prev.disabled = view <= new Date(first.getFullYear(), first.getMonth(), 1);
      next.disabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > last;
      var html = '';
      var lead = view.getDay();
      for (var i = 0; i < lead; i++) html += '<span class="cal-pad"></span>';
      var dim = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (var day = 1; day <= dim; day++) {
        var d = new Date(view.getFullYear(), view.getMonth(), day);
        var ok = openDay(d);
        var sel = picked.date && iso(picked.date) === iso(d);
        html += '<button type="button" class="cal-day' + (sel ? ' is-sel' : '') + '" data-day="' + iso(d) + '"' +
          (ok ? '' : ' disabled') + ' aria-label="' + nice(d) + (ok ? '' : ', unavailable') + '"' +
          (sel ? ' aria-pressed="true"' : '') + '>' + day + '</button>';
      }
      grid.innerHTML = html;
    }

    function renderSlots() {
      if (!picked.date) { slotsBox.hidden = true; return; }
      var list = slotsFor(picked.date);
      slotsDay.textContent = nice(picked.date);
      slotList.innerHTML = list.map(function (t) {
        return '<button type="button" class="slot" data-time="' + t + '">' + t + '</button>';
      }).join('');
      slotsBox.hidden = false;
    }

    function when() { return nice(picked.date) + ' at ' + picked.time; }

    function focusables() {
      return Array.prototype.slice.call(
        modal.querySelectorAll('a[href],button:not([disabled]),input:not([type=hidden]):not([tabindex="-1"])')
      ).filter(function (el) { return el.offsetParent !== null; });
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(); if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }

    function open() {
      var exit = document.getElementById('exitoffer');
      if (exit) exit.hidden = true;
      var help = document.getElementById('helppanel');
      if (help && !help.hidden) { var hc = document.getElementById('helpclose'); if (hc) hc.click(); }
      lastFocus = document.activeElement;
      if (modal.querySelector('.book-done').hidden === false) { picked = { date: null, time: null }; show(1); }
      render(); renderSlots();
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      var target = grid.querySelector('.cal-day:not([disabled])');
      (target || modal.querySelector('.modal-x')).focus();
      document.addEventListener('keydown', onKey, true);
    }
    function close() {
      modal.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey, true);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    window.rkOpenBooking = open;

    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href="/free-inspection/"], [data-book]');
      if (!a || modal.contains(a)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
      e.preventDefault();
      open();
    });

    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) { e.preventDefault(); close(); return; }
      var nav = e.target.closest('[data-cal]');
      if (nav && !nav.disabled) {
        view = new Date(view.getFullYear(), view.getMonth() + Number(nav.getAttribute('data-cal')), 1);
        render(); return;
      }
      var day = e.target.closest('.cal-day');
      if (day && !day.disabled) {
        var p = day.getAttribute('data-day').split('-');
        picked.date = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
        picked.time = null;
        render(); renderSlots();
        var s1 = slotList.querySelector('.slot'); if (s1) s1.focus();
        return;
      }
      var slot = e.target.closest('.slot');
      if (slot) {
        picked.time = slot.getAttribute('data-time');
        form.elements.preferredDate.value = iso(picked.date);
        form.elements.preferredWindow.value = 'Arrival ' + picked.time;
        Array.prototype.forEach.call(modal.querySelectorAll('.book-when'), function (b) { b.textContent = when(); });
        show(2);
        form.elements.firstName.focus();
        return;
      }
      if (e.target.closest('[data-back]')) { show(1); render(); renderSlots(); }
    });

    form.addEventListener('input', function (e) { if (e.target.style) e.target.style.borderColor = ''; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.company_website.value) return;
      var missing = [];
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (f) { if (!f.value.trim()) missing.push(f); });
      var em = form.elements.email, ph = form.elements.phone;
      if (em.value && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(em.value)) missing.push(em);
      if (ph.value && ph.value.replace(/\D/g, '').length < 10) missing.push(ph);
      if (missing.length) {
        status.className = 'formstatus err';
        status.textContent = 'Please check the highlighted fields.';
        missing.forEach(function (f) { f.style.borderColor = '#D64545'; });
        missing[0].focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Booking…';
      status.className = 'formstatus';
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.pageUrl = location.pathname;
      data.message = 'Booked from the website calendar: ' + when();
      fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error('bad status'); })
        .then(function () { form.reset(); show(3); modal.querySelector('.book-done .btn').focus(); })
        .catch(function () {
          status.className = 'formstatus err';
          status.innerHTML = 'That did not go through. Please call <a href="tel:+16143798893"><strong>(614) 379-8893</strong></a> and we will book it for you.';
        })
        .finally(function () { btn.disabled = false; btn.textContent = label; });
    });
  })();
})();
