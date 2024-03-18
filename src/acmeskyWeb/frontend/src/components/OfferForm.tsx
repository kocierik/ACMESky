import { useState } from "react";
import { BASE_URL, BASE_URL_BANK } from "../utils/const";
import Swal from 'sweetalert2';

interface IOffer {
  id: number;
  codice_offerta: string;
  departure_location: string;
  arrival_location: string;
  departure_date: string; // Formato data come stringa (yyyy-mm-dd)
  arrival_date: string; // Formato data come stringa (yyyy-mm-dd)
  price: number; // Prezzo come numero decimale
  disponibile: boolean;
}
const OfferForm = () => {
  const [codiceOfferta, setCodiceOfferta] = useState("");
  const [offer, setOffer] = useState<IOffer>();

  const handleSearch = async () => {
    try {
      const response = await fetch(`${BASE_URL}/checkoffert/${codiceOfferta}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });

      if (!response.ok) {
        Swal.fire({
          title: "Ops!",
          text: "Offerta non esistente!",
          icon: "error",
        });
        return
      }

      const data = await response.json();
      setOffer(data.offer);
      console.log(data);
      console.log("Risposta API:", data);
    } catch (error) {
      Swal.fire({
        title: "Ops!",
        text: "Si e' verificato un errore!",
        icon: "error",
      });
      console.error("Errore:", error);
    }
  };

  const handleBuy = async () => {
    if (!offer) {
      return;
    }
    try {
      const response = await fetch(`${BASE_URL_BANK}/checkout/${offer.codice_offerta}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codiceOfferta: offer.codice_offerta,
          departureLocation: offer.departure_location,
          arrivalLocation: offer.arrival_location,
          departureDate: offer.departure_date,
          arrivalDate: offer.arrival_date,
          price: offer.price
        })
      });
  
      if (!response.ok) {
        throw new Error('Errore durante il checkout');
      }
  
      Swal.fire({
        title: 'Successo!',
        text: 'Richiesta inviata correttamente, verrai reindirizzato al pagamento.',
        icon: 'success'
      }).then(() => {
        window.location.href = `http://localhost:8087`;
      });
    } catch (error) {
      console.error('Errore durante il checkout:', error);
      // Se si verifica un errore, mostra un messaggio di errore all'utente
      Swal.fire({
        title: 'Errore!',
        text: 'Si è verificato un errore durante il checkout.',
        icon: 'error'
      });
    }
  };
  

  return (
    <div className="p-6 bg-gray-100 flex flex-col items-center justify-center">
      <div className="container max-w-screen-sm mx-auto">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
          <div className="flex flex-1 flex-col mb-1">
            <label htmlFor="full_name">Codice Offerta</label>
            <input
              type="text"
              name="codiceOfferta"
              id="codiceOfferta"
              className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
              value={codiceOfferta}
              onChange={(e) => setCodiceOfferta(e.target.value)}
              placeholder="47830"
            />
          </div>
          <div className="md:col-span-5 text-right mt-2">
            <div className="inline-flex items-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSearch}
              >
                Cerca
              </button>
            </div>
          </div>
        </div>

      </div>
      {offer && (
        <div className="flex flex-col overflow-x-auto flex-wrap">
          <div className="sm:-mx-6 lg:-mx-8 flex flex-1">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-x-auto">
                <table className="min-w-full text-start text-sm ">
                  <thead className="border-b border-neutral-200 ">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        Giorno di Partenza
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Giorno di Arrivo
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Ora di Partenza
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Ora di Arrivo
                      </th>
                      <th scope="col" className="px-6 py-4">
                        prezzo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-200 dark:border-white/10">
                      <td className="whitespace-nowrap text-center py-4">
                        {offer.departure_location}
                      </td>
                      <td className="whitespace-nowrap text-center px-6 py-4">
                        {offer.arrival_location}
                      </td>
                      <td className="whitespace-nowrap text-center px-6 py-4">
                        {String(offer.departure_date)}
                      </td>
                      <td className="whitespace-nowrap text-center px-6 py-4">
                        {String(offer.arrival_date)}
                      </td>
                      <td className="whitespace-nowrap text-center px-6 py-4">
                        {offer.price}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            </div>
            <div className="md:col-span-5 text-center mt-2 mb-5">
            <div className="inline-flex items-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleBuy}
              >
                Acquista
              </button>
            </div>
          </div>
          </div>

        )}
    </div>
  );
};

export default OfferForm;
