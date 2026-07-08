import { Tabs, Divider, Button, App } from "antd";
import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { GiLeafSkeleton, GiFlowerPot } from "react-icons/gi";
import { MdEco, MdLocalFlorist, MdSpa } from "react-icons/md";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import FloatingIcon from "../components/FloatingIcon";
import { useAuth } from "../hooks/useAuth";
import "../styles/Home.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export default function RegistrationScreen() {
  const { isAuthenticated, user, googleLogin, googleSignup } = useAuth();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    if (isAuthenticated && user?.id) navigate("/", { replace: true });
  }, [isAuthenticated, user, navigate]);

  const handleGoogle = useCallback(() => {
    if (!window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        if (!response.credential) return;
        try {
          if (activeTab === "login") {
            await googleLogin(response.credential);
          } else {
            await googleSignup(response.credential);
          }
        } catch (err: unknown) {
          let msg = "Error al iniciar sesión con Google";
          if (err && typeof err === "object" && "response" in err) {
            const resp = (err as { response: { data?: { message?: string } } })
              .response;
            if (resp?.data?.message) msg = resp.data.message;
          } else if (err instanceof Error) {
            msg = err.message;
          }
          message.error(msg);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: false,
      ux_mode: "popup",
    });
    window.google.accounts.id.prompt();
  }, [activeTab, googleLogin, googleSignup, message]);

  const starsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
      starsRef.current.forEach((el) => {
        if (!el) return;
        el.style.transform = `translate(${moveX * 1.2}px, ${moveY * 1.2}px)`;
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const tabItems = [
    { key: "login", label: "Entrar", children: <LoginForm /> },
    { key: "signup", label: "Unirse", children: <SignupForm /> },
  ];

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="leaf-pattern absolute inset-0" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-green-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] bg-rose-100/10 rounded-full blur-3xl" />
        {floatingIcons.map((item, i) => (
          <FloatingIcon key={i} {...item} />
        ))}
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center p-6 md:p-12">
        <div
          className="w-full max-w-[1000px] grid md:grid-cols-2 bg-stone-100 rounded-xl overflow-hidden border border-stone-200/50"
          style={{
            boxShadow:
              "0 10px 40px -10px rgba(23,44,33,0.15), 0 4px 12px -4px rgba(129,81,90,0.1)",
          }}
        >
          <div className="hidden md:flex flex-col justify-center items-center bg-stone-50 p-12 text-center relative overflow-hidden border-r border-stone-200/30">
            <div className="relative z-10 space-y-8">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoB7XiPdETy2aWevGbbwB-iCIovm_HxYeKT8PCKcrbagaqpb2Ua36cs19dYnMNZY6H2SVKHJCfHnHNr3GUy7i-a-bsz2quon9ycqmgEiuXLq_3bzXupDeseEVlzhdnbTRQwbtV4r78ROBs2DA0jgX_QR65gJ2naFBOZg8oF06QxJO1DIwvdPGOfp8BLalYAFyOjUDemPuNeMP_tKglcHTwJG1aNthrKAIgzGJ1JFR99N-AZGhk3YSa"
                alt="Dayma Logo"
                className="h-48 w-48 object-contain mx-auto mb-4"
              />
              <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#172c21]">
                Un mundo por descubrir
              </h2>
              <p className="text-stone-500 text-base max-w-sm mx-auto leading-relaxed">
                Donde la magia se encuentra con el confort. Tu aventura en Dayma
                comienza aquí.
              </p>
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-100/30 rounded-full blur-2xl" />
            <MdEco
              className="absolute top-10 right-10 text-green-900/10"
              style={{ fontSize: 80 }}
            />
          </div>

          <div className="p-6 md:p-12 flex flex-col justify-center bg-white/85 backdrop-blur-xl">
            <Tabs
              defaultActiveKey="login"
              centered
              items={tabItems}
              className="dayma-tabs"
              onChange={setActiveTab}
            />

            <Divider className="!border-stone-200 !text-xs !text-stone-400 !font-semibold !uppercase !tracking-wider">
              O usa tu portal favorito
            </Divider>

            <div className="grid grid-cols-1 gap-4 mt-2">
              <Button
                size="large"
                onClick={handleGoogle}
                className="!flex !items-center !justify-center !gap-2 !border-stone-200 !rounded-lg !font-semibold !text-sm hover:!border-green-900 hover:!bg-green-900/5 !transition-all !duration-300 active:!scale-95"
              >
                <FaGoogle className="text-[#4285F4] text-base" />
                Google
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

const floatingIcons = [
  {
    Icon: MdSpa,
    style: { top: "15%", left: "10%" },
    size: 48,
    delay: "0s",
    className: "text-green-900/10",
  },
  {
    Icon: GiLeafSkeleton,
    style: { bottom: "20%", right: "12%" },
    size: 64,
    delay: "1s",
    className: "text-rose-700/10",
  },
  {
    Icon: MdLocalFlorist,
    style: { top: "40%", right: "5%" },
    size: 32,
    delay: "0.5s",
    className: "text-green-900/10",
  },
  {
    Icon: GiFlowerPot,
    style: { bottom: "10%", left: "8%" },
    size: 40,
    delay: "1.5s",
    className: "text-green-900/10",
  },
];
