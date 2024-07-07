# ACMESky - Documentazione progetto

Il seguente report descrive i processi che hanno portato alla realizzazione del progetto didattico del corso **Ingegneria del Software Orientata ai Servizi** della LM Informatica dell'Università di Bologna, svolto da Erik Koci e Manuel Arto nell'A.A. 2023/2024.

## Descrizione del progetto
Realizzare una **Service Oriented Architecture** (**SOA**) che rappresenti la realtà di una compagnia chiamata *ACMESky*.  
*ACMESky* fornisce ai propri utenti la possibilità di venire notificati e successivamente acquistare offerte di voli A/R in determinate date e al di sotto di una certa soglia di prezzo, da loro scelte in precedenza.

*ACMESky* si relaziona con diversi servizi esterni all'organizzazione:

- le *compagnie aeree* (o *Flight Company*) per il controllo della presenza di offerte e l'acquisto dei voli;
- le *compagnie di noleggio con autista*, da noi rinominate in *compagnie di trasporto* (o *Travel Company*), per la prenotazione del trasporto gratuito degli utenti da casa all'aeroporto e viceversa;
- il servizio per il calcolo delle *distanze geografiche* (o *Geographical Distances*);
- il sistema bancario, da noi rinominato in *provider di pagamenti* (o *Payment Provider*), che si occupa di gestire i pagamenti per l'acquisto dei voli da parte degli utenti;
- il servizio *ProntoGram*, con il quale contattare gli utenti per comunicar loro i codici delle offerte.

### Assunzioni e semplificazioni

Essendo un progetto a scopo didattico sono state adottate alcune assunzioni e semplificazioni sul funzionamento dei vari servizi, che vengono elencati di seguito:

- Attualmente non sono presenti controlli di sicurezza riguardo alla possibilità di eseguire determinati api che dovrebbero essere private, come ad esempio la creazione di un determinato volo, sarebbe necessario implementare un meccanismo che utilizzi un proxy per limitare le richieste agli utenti autorizzati
- gli aspetti relativi alla sicurezza delle comunicazioni e dei dati sono stati ignorati mentre, ad esempio, sarebbe stato corretto utilizzare il protocollo HTTPS per le comunicazioni;
- i voli offerti dalle *compagnie aeree* sono tutti diretti e quando vengono assegnati ad un offerta *ACMESky* chiede di riservare un posto alle *compagnie aeree* in modo da evitare, al momento dell'acquisto, un errore dovuto alla mancanza di disponibilità di posti a sedere;

## Struttura del sito
Il seguente sito è strutturato come segue:
	
- [Coreografie](docs/coreografie.md): descrizione delle coreografie da noi progettate, la verifica della loro connectedness e le loro proiezioni sui diversi ruoli;
- [Coreografie BPMN](docs/coreografiebpmn.md): descrizione delle coreografie della precedente sezione mediante coreografie BPMN;
- [BPMN](docs/bpmn.md): descrizione delle coreografie sotto forma di diagrammi BPMN;
- [UML](docs/uml.md): descrizione della SOA tramite diagrammi UML con profilo TinySOA;
- [Istruzioni per l'avvio](docs/executeinstruction.md): Istruzioni per avviare l'infrastruttura;