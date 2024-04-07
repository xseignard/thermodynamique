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
  prixBallonElec: number;
  prixBallonThermo: number;
  coutElec?: number;
  coutThermo?: number;
  roi?: number;
};

type Actions = {
  type:
    | "SET_FACTEUR_ELEC"
    | "SET_VOLUME"
    | "SET_EAU_CHAUDE"
    | "SET_EAU_FROIDE"
    | "SET_EAU_CONSOMMEE"
    | "SET_PRIX_ELEC"
    | "SET_COP"
    | "SET_PRIX_BALLON_ELEC"
    | "SET_PRIX_BALLON_THERMO"
    | "SET_COUT_ELEC"
    | "SET_COUT_THERMO"
    | "SET_ROI";
  payload: number;
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
    case "SET_PRIX_BALLON_ELEC":
      return { ...state, prixBallonElec: action.payload };
    case "SET_PRIX_BALLON_THERMO":
      return { ...state, prixBallonThermo: action.payload };

    // outputs
    case "SET_COUT_ELEC":
      return { ...state, coutElec: action.payload };
    case "SET_COUT_THERMO":
      return { ...state, coutThermo: action.payload };
    case "SET_ROI":
      return { ...state, roi: action.payload };
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
    cop: 3.2,
    prixBallonElec: 600,
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
      prixBallonElec,
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
    const energie = deltaChauffe * volume * facteurElec * 365;
    // Coût annuel
    const cout = parseFloat(((energie / (1000 * 1000)) * prixElec).toFixed(2));
    dispatch({ type: "SET_COUT_ELEC", payload: cout });
    const coutThermo = parseFloat((cout / cop).toFixed(2));
    dispatch({ type: "SET_COUT_THERMO", payload: coutThermo });
    // ROI
    const deltaPrix = prixBallonThermo - prixBallonElec;
    const economieAnnuelle = cout - coutThermo;
    const roi = parseFloat((deltaPrix / economieAnnuelle).toFixed(2));
    dispatch({ type: "SET_ROI", payload: roi });
  };
  return (
    <main
      className="flex min-h-screen flex-col w-4/12 p-4 gap-8"
      style={{ maxWidth: 450 }}
    >
      <form className="flex flex-col items-start gap-4" onSubmit={handleSubmit}>
        <Input
          label="Volume ballon"
          initialValue={state.volume}
          onChange={(value) => dispatch({ type: "SET_VOLUME", payload: value })}
        />
        <Input
          label="T° eau chaude"
          initialValue={state.eauChaude}
          onChange={(value) =>
            dispatch({ type: "SET_EAU_CHAUDE", payload: value })
          }
        />
        <Input
          label="T° eau froide"
          initialValue={state.eauFroide}
          onChange={(value) =>
            dispatch({ type: "SET_EAU_FROIDE", payload: value })
          }
        />
        <Input
          label="Eau consommée par jour"
          initialValue={state.eauConsommee}
          onChange={(value) =>
            dispatch({ type: "SET_EAU_CONSOMMEE", payload: value })
          }
        />
        <Input
          label="Prix électricité"
          initialValue={state.prixElec}
          step={0.01}
          onChange={(value) =>
            dispatch({ type: "SET_PRIX_ELEC", payload: value })
          }
        />
        <Input
          label="Cop"
          initialValue={state.cop}
          step={0.01}
          onChange={(value) => dispatch({ type: "SET_COP", payload: value })}
        />
        <Input
          label="Prix ballon électrique"
          initialValue={state.prixBallonElec}
          onChange={(value) =>
            dispatch({ type: "SET_PRIX_BALLON_ELEC", payload: value })
          }
        />
        <Input
          label="Prix ballon thermodynamique"
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
      {state.coutElec !== undefined && state.coutThermo !== undefined && (
        <div className="flex flex-col items-start gap-4">
          <h2>Résultats</h2>
          <div className="flex flex-row justify-between items-center w-full">
            <span>Chauffe eau classique:</span>
            <span>{state.coutElec}€</span>
          </div>
          <div className="flex flex-row justify-between items-center w-full">
            <span>Chauffe eau thermodynamique:</span>
            <span>{state.coutThermo}€</span>
          </div>
          <div className="flex flex-row justify-between items-center w-full">
            <span>Retour sur investissement:</span>
            <span>{state.roi} ans</span>
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
