"use client";

import { SyntheticEvent, useReducer } from "react";

type FormState = {
  facteurElec: number;
  volume: number;
  eauChaude: number;
  eauFroide: number;
  eauConsommee: number;
  prixElec: number;
  cop: number;
  kwhAnnuelPlat: number;
  prixBallonElec: number;
  prixBallonPlat: number;
  prixBallonThermo: number;
  kwhElec?: number;
  coutElec?: number;
  coutPlat?: number;
  kwThermo?: number;
  coutThermo?: number;
  roiElecPlat?: {
    years: number;
    months: number;
  };
  roiElecThermo?: {
    years: number;
    months: number;
  };
  roiPlatThermo?: {
    years: number;
    months: number;
  };
};

type Actions =
  | {
      type:
        | "SET_FACTEUR_ELEC"
        | "SET_VOLUME"
        | "SET_EAU_CHAUDE"
        | "SET_EAU_FROIDE"
        | "SET_EAU_CONSOMMEE"
        | "SET_PRIX_ELEC"
        | "SET_COP"
        | "SET_KWH_ANNUEL_PLAT"
        | "SET_PRIX_BALLON_ELEC"
        | "SET_PRIX_BALLON_PLAT"
        | "SET_PRIX_BALLON_THERMO"
        | "SET_KWH_ELEC"
        | "SET_COUT_ELEC"
        | "SET_COUT_PLAT"
        | "SET_KW_THERMO"
        | "SET_COUT_THERMO";
      payload: number;
    }
  | {
      type: "SET_ROI_ELEC_THERMO" | "SET_ROI_ELEC_PLAT" | "SET_ROI_PLAT_THERMO";
      payload: {
        years: number;
        months: number;
      };
    };

const reducer = (state: FormState, action: Actions) => {
  switch (action.type) {
    // inputs
    case "SET_FACTEUR_ELEC":
      return { ...state, facteurElec: action.payload };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    case "SET_EAU_CHAUDE":
      return { ...state, eauChaude: action.payload };
    case "SET_EAU_FROIDE":
      return { ...state, eauFroide: action.payload };
    case "SET_EAU_CONSOMMEE":
      return { ...state, eauConsommee: action.payload };
    case "SET_PRIX_ELEC":
      return { ...state, prixElec: action.payload };
    case "SET_COP":
      return { ...state, cop: action.payload };
    case "SET_KWH_ANNUEL_PLAT":
      return { ...state, kwhAnnuelPlat: action.payload };
    case "SET_PRIX_BALLON_ELEC":
      return { ...state, prixBallonElec: action.payload };
    case "SET_PRIX_BALLON_PLAT":
      return { ...state, prixBallonPlat: action.payload };
    case "SET_PRIX_BALLON_THERMO":
      return { ...state, prixBallonThermo: action.payload };

    // outputs
    case "SET_KWH_ELEC":
      return { ...state, kwhElec: action.payload };
    case "SET_COUT_ELEC":
      return { ...state, coutElec: action.payload };
    case "SET_COUT_PLAT":
      return { ...state, coutPlat: action.payload };
    case "SET_KW_THERMO":
      return { ...state, kwThermo: action.payload };
    case "SET_COUT_THERMO":
      return { ...state, coutThermo: action.payload };
    case "SET_ROI_ELEC_PLAT":
      return { ...state, roiElecPlat: action.payload };
    case "SET_ROI_ELEC_THERMO":
      return { ...state, roiElecThermo: action.payload };
    case "SET_ROI_PLAT_THERMO":
      return { ...state, roiPlatThermo: action.payload };
    default:
      return state;
  }
};

const Home = () => {
  const [state, dispatch] = useReducer(reducer, {
    facteurElec: 1162,
    volume: 150,
    eauChaude: 60,
    eauFroide: 12,
    eauConsommee: 150,
    prixElec: 0.2068,
    cop: 3.55,
    kwhAnnuelPlat: 1440,
    prixBallonElec: 600,
    prixBallonPlat: 750,
    prixBallonThermo: 2000,
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const {
      facteurElec,
      volume,
      eauChaude,
      eauFroide,
      eauConsommee,
      prixElec,
      cop,
      kwhAnnuelPlat,
      prixBallonElec,
      prixBallonPlat,
      prixBallonThermo,
    } = state;
    // Température de l'eau avant chauffe
    const proportionChaude = (volume - eauConsommee) / volume;
    const proportionFroide = eauConsommee / volume;
    const tempAvantChauffe =
      eauChaude * proportionChaude + eauFroide * proportionFroide;
    // Delta chauffe
    const deltaChauffe = eauChaude - tempAvantChauffe;
    // Energie nécessaire chauffe eau classique
    const khwElecFloat =
      (deltaChauffe * volume * facteurElec * 365) / (1000 * 1000);
    const kwhElec = parseFloat(khwElecFloat.toFixed(2));
    dispatch({ type: "SET_KWH_ELEC", payload: kwhElec });
    // Energie nécessaire chauffe eau thermodynamique
    const kwThermo = parseFloat((khwElecFloat / cop).toFixed(2));
    dispatch({ type: "SET_KW_THERMO", payload: kwThermo });
    // Coût annuel
    const coutElec = parseFloat((kwhElec * prixElec).toFixed(2));
    dispatch({ type: "SET_COUT_ELEC", payload: coutElec });
    const coutPlat = parseFloat((kwhAnnuelPlat * prixElec).toFixed(2));
    dispatch({ type: "SET_COUT_PLAT", payload: coutPlat });
    const coutThermo = parseFloat((kwThermo * prixElec).toFixed(2));
    dispatch({ type: "SET_COUT_THERMO", payload: coutThermo });
    // ROI ELEC PLAT
    const deltaPrixPlat = prixBallonPlat - prixBallonElec;
    const economieAnnuellePlat = coutElec - coutPlat;
    const roiFloatPlat = parseFloat(
      (deltaPrixPlat / economieAnnuellePlat).toFixed(2)
    );
    const roiYearsPlat = Math.floor(roiFloatPlat);
    const roiMonthsPlat = Math.round((roiFloatPlat - roiYearsPlat) * 12);
    dispatch({
      type: "SET_ROI_ELEC_PLAT",
      payload: { years: roiYearsPlat, months: roiMonthsPlat },
    });
    // ROI ELEC THERMO
    const deltaPrixThermo = prixBallonThermo - prixBallonElec;
    const economieAnnuelleThermo = coutElec - coutThermo;
    const roiFloatThermo = parseFloat(
      (deltaPrixThermo / economieAnnuelleThermo).toFixed(2)
    );
    const roiYearsThermo = Math.floor(roiFloatThermo);
    const roiMonthsThermo = Math.round((roiFloatThermo - roiYearsThermo) * 12);
    dispatch({
      type: "SET_ROI_ELEC_THERMO",
      payload: { years: roiYearsThermo, months: roiMonthsThermo },
    });
    // ROI PLAT THERMO
    const deltaPrixPlatThermo = prixBallonThermo - prixBallonPlat;
    const economieAnnuellePlatThermo = coutPlat - coutThermo;
    const roiFloatPlatThermo = parseFloat(
      (deltaPrixPlatThermo / economieAnnuellePlatThermo).toFixed(2)
    );
    const roiYearsPlatThermo = Math.floor(roiFloatPlatThermo);
    const roiMonthsPlatThermo = Math.round(
      (roiFloatPlatThermo - roiYearsPlatThermo) * 12
    );
    dispatch({
      type: "SET_ROI_PLAT_THERMO",
      payload: { years: roiYearsPlatThermo, months: roiMonthsPlatThermo },
    });
  };
  return (
    <main className="flex min-h-screen flex-col w-full md:max-w-md max-w-full p-4 gap-8 overflow-auto">
      <form className="flex flex-col items-start gap-4" onSubmit={handleSubmit}>
        <Input
          label="Volume ballon (L)"
          initialValue={state.volume}
          onChange={(value) => dispatch({ type: "SET_VOLUME", payload: value })}
        />
        <Input
          label="T° eau chaude (°C)"
          initialValue={state.eauChaude}
          onChange={(value) =>
            dispatch({ type: "SET_EAU_CHAUDE", payload: value })
          }
        />
        <Input
          label="T° eau froide (°C)"
          initialValue={state.eauFroide}
          onChange={(value) =>
            dispatch({ type: "SET_EAU_FROIDE", payload: value })
          }
        />
        <Input
          label="Eau consommée par jour (L)"
          initialValue={state.eauConsommee}
          onChange={(value) =>
            dispatch({ type: "SET_EAU_CONSOMMEE", payload: value })
          }
        />
        <Input
          label="Prix électricité (€/kWh)"
          initialValue={state.prixElec}
          step={0.01}
          onChange={(value) =>
            dispatch({ type: "SET_PRIX_ELEC", payload: value })
          }
        />
        <Input
          label="Consommation ballon plat (kWh/an)"
          initialValue={state.kwhAnnuelPlat}
          onChange={(value) =>
            dispatch({ type: "SET_KWH_ANNUEL_PLAT", payload: value })
          }
        />
        <Input
          label="COP"
          initialValue={state.cop}
          step={0.01}
          onChange={(value) => dispatch({ type: "SET_COP", payload: value })}
        />
        <Input
          label="Prix ballon électrique (€)"
          initialValue={state.prixBallonElec}
          onChange={(value) =>
            dispatch({ type: "SET_PRIX_BALLON_ELEC", payload: value })
          }
        />
        <Input
          label="Prix ballon plat (€)"
          initialValue={state.prixBallonPlat}
          onChange={(value) =>
            dispatch({ type: "SET_PRIX_BALLON_PLAT", payload: value })
          }
        />
        <Input
          label="Prix ballon thermo (€)"
          initialValue={state.prixBallonThermo}
          onChange={(value) =>
            dispatch({ type: "SET_PRIX_BALLON_THERMO", payload: value })
          }
        />
        <button
          className="w-full h-12 bg-blue-500 text-white rounded"
          type="submit"
        >
          Calcul
        </button>
      </form>
      {state.kwhElec !== undefined &&
        state.coutElec !== undefined &&
        state.coutPlat !== undefined &&
        state.kwThermo !== undefined &&
        state.coutThermo !== undefined &&
        state.roiElecPlat !== undefined &&
        state.roiElecThermo !== undefined &&
        state.roiPlatThermo !== undefined && (
          <div className="flex flex-col items-start gap-4">
            <h2 className="font-medium size-6 w-full">Résultats</h2>
            <h3 className="font-medium">Chauffe eau classique:</h3>
            <div className="flex flex-row justify-between items-center w-full">
              <span>{state.coutElec}€/an</span>
              <span>{state.kwhElec}kWh/an</span>
            </div>
            <h3 className="font-medium">Chauffe eau plat:</h3>
            <div className="flex flex-row justify-between items-center w-full">
              <span>{state.coutPlat}€/an</span>
              <span>{state.kwhAnnuelPlat}kWh/an</span>
            </div>
            <h3 className="font-medium">Chauffe eau thermodynamique:</h3>
            <div className="flex flex-row justify-between items-center w-full">
              <span>{state.coutThermo}€/an</span>
              <span>{state.kwThermo}kWh/an</span>
            </div>
            <h2 className="font-medium size-6 w-full">
              Retour sur investissement
            </h2>
            <div className="flex flex-row justify-between items-center w-full">
              <span>plat depuis elec:</span>
              <span>
                {state.roiElecPlat.years} ans, {state.roiElecPlat.months} mois
              </span>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <span>thermo depuis elec:</span>
              <span>
                {state.roiElecThermo.years} ans, {state.roiElecThermo.months}{" "}
                mois
              </span>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <span>thermo depuis plat:</span>
              <span>
                {state.roiPlatThermo.years} ans, {state.roiPlatThermo.months}{" "}
                mois
              </span>
            </div>
          </div>
        )}
    </main>
  );
};

const Input = ({
  label,
  initialValue,
  step = 1,
  onChange,
}: {
  label: string;
  initialValue?: number;
  step?: number;
  onChange: (value: number) => void;
}) => {
  return (
    <div className="flex flex-row justify-between items-center w-full">
      <label htmlFor={label} className="pr-4">
        {label}
      </label>
      <input
        id={label}
        type="number"
        step={step}
        value={initialValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-40 h-12 px-4 border border-gray-300 rounded"
      />
    </div>
  );
};

export default Home;
