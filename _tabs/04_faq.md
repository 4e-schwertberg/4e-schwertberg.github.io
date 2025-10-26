---
layout: page
title: FAQ
order: 4
permalink: /faq/
icon: "fas fa-question-circle"
---

{% if site.data.faq %}
{% for question in site.data.faq %}
<div class="card bg-light mb-3">
  <div class="card-body">
    <h5 class="card-title"><b>{{ question.q }}</b></h5>
    <p class="card-text">{{ question.a }}</p>
  </div>
</div>
{% endfor %}
{% endif %}
