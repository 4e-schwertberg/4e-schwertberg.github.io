---
layout: page
title: Impressum
permalink: /impressum/
icon: fas fa-info-circle
order: 8
---

**Medieninhaber**
: {{ site.data.config4e.contact.fullName }}

**Anschrift**
: {{ site.data.config4e.contact.street }}\\
{{ site.data.config4e.contact.zip }} {{ site.data.config4e.contact.town }}\\
<i class="fas fa-envelope"></i> {{ site.data.config4e.contact.mailInfo }}\\
<i class="fas fa-phone"></i> {{ site.data.config4e.contact.phoneNumber }}\\
\\
ZVR: {{ site.data.config4e.details.zvr }}\\
UID: {{ site.data.config4e.details.uid }}

{% if site.data.config4e.contact.boardMember %}
**Vorstandsmitglieder**

<ul>
{% for m in site.data.config4e.contact.boardMember %}
<li>{{ m.role }}: {{ m.firstName }} {{ m.lastName }}</li>
{% endfor %}
</ul>
{% endif %}

**Vereinsstatuten**
: [Vereinsstatuten_4E_Schwertberg.pdf]({{ site.data.config4e.statuten.url }})

**Aufsichtsbehörde**
: Bezirkshauptmannschaft Perg

**Vereinszweck**
: Der Vereinszweck umfasst unter Berücksichtigung ökologischer (Klima-, Natur- und Landschaftsschutz;
Förderung der Erzeugung von Energie aus erneuerbaren Energiequellen), gemeinwirtschaftlicher und
sozialgemeinschaftlicher Zielsetzungen (§ 79 Abs 2 EAG):

- Energieerzeugung;
- Verbrauch eigenerzeugter Energie;
- Verkauf von Energie
- Speicherung von Energie
- Energiedienstleistungen, insbesondere auch Energieberatungen zu den Themen "Energiesparen" und "Energieeffizienz"

**Beschwerden**
: Beschwerden richten Sie bitte an die oben angegebene E-Mail-Adresse.

**Haftungshinweis**
: Trotz sorgfältiger inhaltlicher Kontrolle können wir keine Haftung für die Inhalte externer Links übernehmen. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich. 
