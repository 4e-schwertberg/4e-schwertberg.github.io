---
layout: page
title: Preise
permalink: /preise/
icon: fas fa-eur
order: 2
---


# Aktuelle Tarife

{% assign costs = site.data.config4e.costs %}

## Mitgliedsbeitrag

Der Mitgliedsbeitrag beträgt **{{ costs.membershipFeeWithVAT }} Euro pro Jahr** ({{ costs.membershipFeeNet }} Euro zuzüglich {{ costs.vat }} MWSt) für jeden Zählpunkt.

## Tarife

Einspeisetarif (Sie liefern Strom an die Gemeinschaft)
: {{ costs.price_seller }} {{ costs.price_seller_unit }} netto

Abnahmetarif (Sie beziehen Strom aus der Gemeinschaft)
: {{ costs.price_buyer }} {{ costs.price_buyer_unit }} netto

Diese Tarife gelten seit {{ costs.price_last_change }}.

## Was kostet eine kWh insgesamt? {#vergleich}

Die Grafik zeigt, wie sich der Preis für eine kWh zusammensetzt und woher die Ersparnis kommt. Grundlage sind unser Abnahmetarif und das [Preisblatt 2026 der Linz Netz GmbH](https://www.linznetz.at/media/linz_netz_website/netz_dokumente/Strom-Netzentgelte-Abgaben-2026.pdf) (Netzentgelte und Abgaben, gültig ab 1. Jänner 2026).

{% include energy-chart.html %}

**So haben wir gerechnet:**

- Haushalt im Netz der Linz Netz GmbH (Netzebene 7, ohne Leistungsmessung), Regionalbereich, Werte 2026.
- Alle Preise pro kWh und brutto, also inklusive 20 % Umsatzsteuer.
- Für den herkömmlichen Strombezug setzen wir denselben Energiepreis an wie unseren Abnahmetarif. Ihr Stromlieferant kann mehr oder weniger verlangen.
- Wir nehmen an, dass die ganze kWh aus der Gemeinschaft kommt. In Wirklichkeit deckt die Gemeinschaft nur einen Teil Ihres Verbrauchs ab. Für den Rest zahlen Sie die normalen Preise.
- Bei den Abgaben rechnen wir mit 0,1 Cent Elektrizitätsabgabe pro kWh, wie sie 2026 für Haushalte gilt.
- Fixe Kosten pro Jahr sind nicht enthalten, zum Beispiel Mitgliedsbeitrag, Messentgelt, Leistungspreis und Erneuerbaren-Förderpauschale.

Irrtümer vorbehalten.

## Vorteile für Mitglieder {#vorteile}

Die Teilnahme an einer **Energiegemeinschaft** ist ein Beitrag zum Klimaschutz und stärkt die Region. Dazu kommen gesetzliche Ermäßigungen. Sie gelten **nur für den Strom, den Sie aus der Gemeinschaft beziehen** – nicht für den Rest Ihres Verbrauchs:

- **Geringeres Netznutzungsentgelt:** 2026 zahlen Sie dafür um 28 % weniger (Regionalbereich). Die Ermäßigung gilt nur für den Arbeitspreis des Netznutzungsentgelts – nicht für das Netzverlustentgelt und nicht für Pauschalen wie den Leistungspreis oder das Messentgelt.
- **Keine Elektrizitätsabgabe:** 2026 zahlen Haushalte dafür 0,1 Cent pro kWh. Ab 2027 sind es nach derzeitigem Gesetz wieder 1,5 Cent pro kWh (jeweils ohne USt).
- **Kein Erneuerbaren-Förderbeitrag pro kWh:** Für den Strom aus der Gemeinschaft entfällt der Erneuerbaren-Förderbeitrag, der pro kWh verrechnet wird (2026: 0,62 Cent pro kWh). Die jährlichen Beträge zahlen Sie aber weiterhin: den Erneuerbaren-Förderbeitrag auf den Leistungspreis (2026: 3,80 Euro) und die Erneuerbaren-Förderpauschale (2026: 19,02 Euro pro Zählpunkt). Alle Beträge ohne USt.

> **Ausblick 2027:** Laut einem Verordnungsentwurf der E-Control soll die Ermäßigung beim Netznutzungsentgelt ab 1. Jänner 2027 im Regionalbereich nur noch 22 % betragen. Die endgültigen Werte stehen noch nicht fest. Wir aktualisieren diese Seite, sobald sie beschlossen sind.
{: .prompt-info }

{% comment %} TODO(admin): Sobald die Systemnutzungsentgelte-Verordnung 2027 kundgemacht ist: Prozentsatz hier, auf /infos/ und im FAQ anpassen, energy_chart in config4e.yml auf 2027 umstellen (Elektrizitätsabgabe ab 1.1.2027: 1,5 statt 0,1 Cent, § 4 Abs. 2 ElAbgG; auch im Punkt „So haben wir gerechnet“) und den Ausblick entfernen. {% endcomment %}

> Auch wenn Ihr Stromlieferant den gleichen Energiepreis verlangt: Für den Strom aus der Gemeinschaft zahlen Sie wegen dieser Ermäßigungen insgesamt weniger.
{: .prompt-tip }

### Hinweis
Die Mitgliedsbeiträge und die Differenz zwischen Ein- und Verkaufspreis dienen ausschließlich der Finanzierung der laufenden Kosten des Vereins. 4E Schwertberg ist nicht gewinnorientiert.
