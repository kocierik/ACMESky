import { useState } from "react";
import { BASE_URL, BASE_URL_SSE } from "../utils/const";
import Swal from "sweetalert2";

interface IFlight {
  flight_code: string;
  departure_location: string;
  arrival_location: string;
  arrival_date: string; // Formato data come stringa (yyyy-mm-dd)
  departure_date: string; // Formato data come stringa (yyyy-mm-dd)
  airline_name: string;
  price: number; // Prezzo come numero decimale
  valid: boolean;
}

const OfferForm = () => {
  const [codiceOfferta, setCodiceOfferta] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [flights, setFlights] = useState<IFlight[]>([])

   const handleSSE = async () => {
    const eventSource = new EventSource(`${BASE_URL_SSE}/events`, {withCredentials: true});

    eventSource.addEventListener('flightInfos', event => {
      const data = JSON.parse(event.data);
      console.log('Received flight infos:', data);
    });

    eventSource.addEventListener('errors', event => {
      const data = JSON.parse(event.data);
      console.error('Received error:', data);
      Swal.fire({
        title: "Errore!",
        text: data.message,
        icon: "error",
      });
      eventSource.close();
    });

    eventSource.addEventListener('payment_url', event => {
      const data = JSON.parse(event.data);
      console.log('Received payment URL:', data);
      Swal.fire({
        title: "Pagamento in corso",
        text: "Chiudi la finestra quando avrai completato il pagamento",
        icon: "success",
      });
      window.open(data.payment_url, '_blank');
    });

    eventSource.addEventListener('tickets', event => {
      const data = JSON.parse(event.data);
      console.log('Received tickets:', data);
    });


    eventSource.addEventListener('flights_infos', event => {
      const data = JSON.parse(event.data);
      console.log('Received flights:', data.flights);
      setFlights(data.flights)
    });

    eventSource.onerror = (event) => {
      console.error('EventSource failed:', event);
    };

    return () => {
      eventSource.close();
    };
  };

  const handleSearch = async () => {
    try {
      await handleSSE();

      const response = await fetch(`${BASE_URL}/buyOffer/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }, 
        body: JSON.stringify({
          offerCode: codiceOfferta,
          address: domicilio,
          userId: JSON.parse(localStorage.getItem("user")!)['id']
        }),
      });

      if (!response.ok) {
        Swal.fire({
          title: "Ops!",
          text: "Offerta non esistente!",
          icon: "error",
        });
        return;
      }

    } catch (error) {
      Swal.fire({
        title: "Ops!",
        text: "Si e' verificato un errore!",
        icon: "error",
      });
      console.error("Errore:", error);
    }
  };

  return (
    <div className="p-3 bg-gray-100 flex flex-col items-center justify-center">
      <div className="container max-w-screen-sm mx-auto">
        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-2">
          <div className="flex flex-1 flex-col mb-1">
            <label htmlFor="full_name">Codice Offerta</label>
            <input
              type="text"
              name="codiceOfferta"
              id="codiceOfferta"
              className="h-10 border mt-1 mb-5 rounded px-4 w-full bg-gray-50"
              value={codiceOfferta}
              onChange={(e) => setCodiceOfferta(e.target.value)}
              placeholder="47830"
            />
            <label htmlFor="domicilio">Domicilio</label>
            <div className="flex flex-1 flex-row mb-1">
              <input
                type="text"
                name="domicilio"
                id="domicilio"
                className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                value={domicilio}
                onChange={(e) => setDomicilio(e.target.value)}
                placeholder="Bologna"
                />
            </div>
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
        <>
        {flights?.length > 0 && (
          <div className="flex flex-col overflow-x-auto flex-wrap">
            <div className="sm:-mx-6 lg:-mx-8 flex flex-1">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-start text-sm ">
                    <thead className="border-b border-neutral-200 ">
                      <tr>
                        <th scope="col" className="px-6 py-4">
                          Partenza
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Arrivo
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Data di Partenza
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Data di Arrivo
                        </th>
                        <th scope="col" className="px-6 py-4">
                          prezzo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {flights?.map(flight => {
                      return (
                      <tr className="border-b border-neutral-200 dark:border-white/10">
                        <td className="whitespace-nowrap text-center py-4">
                          {flight?.departure_location}
                        </td>
                        <td className="whitespace-nowrap text-center px-6 py-4">
                          {flight?.arrival_location}
                        </td>
                        <td className="whitespace-nowrap text-center px-6 py-4">
                          {String(flight?.arrival_date)}
                        </td>
                        <td className="whitespace-nowrap text-center px-6 py-4">
                          {String(flight?.departure_date)}
                        </td>
                        <td className="whitespace-nowrap text-center px-6 py-4">
                          {flight?.price}
                        </td>
                      </tr>
                      )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
       )} 
        </>
    </div>
  );
};

export default OfferForm;
