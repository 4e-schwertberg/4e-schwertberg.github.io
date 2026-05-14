---
layout: page
title: Preise
permalink: /preise/
icon: fas fa-eur
order: 2
---


# Aktuelle Tarife

## Mitgliedsbeitrag

Der Mitgliedsbeitrag beträgt **{{ site.data.config4e.costs.membershipFeeWithVAT }} EUR pro Jahr (inkl. {{ site.data.config4e.costs.vat }} USt)** für jeden Zählpunkt.

Einspeisetarif (Stromlieferant)
: {{ site.data.config4e.costs.price_seller }} {{ site.data.config4e.costs.price_seller_unit }} netto[^1]

Abnahmetarif (Stromverbraucher)
: {{ site.data.config4e.costs.price_buyer }} {{ site.data.config4e.costs.price_buyer_unit }} netto[^1]

## Grafische Darstellung Gesamtpreis

Die folgende Grafik soll zeigen, woher die Einsparung der EEG kommt. Basis der Verrechnung ist der oben angegebene Energiepreis, sowie das [Preisblatt](https://www.linznetz.at//media/linz_netz_website/netz_dokumente/Strom-Netzentgelte-Abgaben-2026.pdf) der Linz Netz GmbH.

Die angezeigten Preise sind die brutto _Gesamtkosten pro verrechneter kWh_. Darin enthalten sind Energiepreis, Abgaben und Steuern.

Stand: Jänner 2026, Irrtümer vorbehalten!

{% include energy-chart.html %}

## Vorteile für Mitglieder

Die Teilnahme an einer **Energiegemeinschaft (EEG)** bietet nicht nur einen aktiven Beitrag zum Klimaschutz und stärkt die Regionalität sowie die Gemeinschaft vor Ort, sondern auch wirtschaftliche Vorteile:

- **Reduktion der Netzentgelte um 28%**
- **Befreiung der Elektrizitäts-Abgabe**
- **Entfall des Erneuerbaren-Förderbeitrags**

> Auch wenn Ihr Stromversorger Ihnen den gleichen Preis bietet, sorgt die Energiegemeinschaft durch gesetzlich geregelte Ermäßigungen für eine günstigere Verrechnung der gleichen Bezugsmenge.
{: .prompt-tip }

### Hinweis
Die Einhebung von Mitgliedsbeiträgen und die Differenz zwischen Ein- und Verkauf dienen dem
Verein ausschließlich zur Finanzierung der laufenden Betriebskosten. 4E Schwertberg ist nicht gewinnorientiert.

[^1]: Angaben ohne Gewähr - Für das 2. Quartal 2026 verzichten wir auf den Deckungsaufschlag, Betriebskosten werden in diesem Zeitraum aus Rücklagen finanziert. - Stand: {{ site.data.config4e.costs.price_last_change }}
