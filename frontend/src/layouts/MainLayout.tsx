import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function MainLayout() {
    const [onRun, setOnRun] = useState<(() => void) | undefined>();
    const [onSubmit, setOnSubmit] = useState<(() => void) | undefined>();
    const [onPrev, setOnPrev] = useState<(() => void) | undefined>();
    const [onNext, setOnNext] = useState<(() => void) | undefined>();
    const [disableActions, setDisableActions] = useState(false);

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-slate-200">
            <Navbar
                onRun={onRun}
                onSubmit={onSubmit}
                onPrev={onPrev}
                onNext={onNext}
                disableActions={disableActions}
            />

            <Outlet
                context={{
                    setOnRun,
                    setOnSubmit,
                    setOnPrev,
                    setOnNext,
                    setDisableActions,
                }}
            />
        </div>
    );
}
