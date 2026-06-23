import { Button, Form, Input, App } from "antd";
import { MdEmail, MdLock, MdArrowForward } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import type { LoginRequest } from "../../types/auth";

const inputClass =
  "!rounded-lg !border-stone-200 !bg-white !text-sm !py-2 focus:!border-green-900 focus:!ring-1 focus:!ring-green-900/40 !shadow-[inset_2px_2px_8px_rgba(0,0,0,0.02)]";

export default function LoginForm() {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const { message } = App.useApp();

  const handleLogin = async (values: LoginRequest) => {
    try {
      await login(values);
    } catch {
      message.error("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <div className="space-y-2">
      <header className="text-center mb-8">
        <h1 className="font-['Playfair_Display'] text-3xl font-semibold text-stone-800 mb-2">
          ¡Hola de nuevo!
        </h1>
        <p className="text-stone-500 text-sm">Vuelve a tu hogar mágico</p>
      </header>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleLogin}
      >
        <Form.Item
          label={
            <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
              Tu Correo Mágico
            </span>
          }
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Ingresa un correo válido",
            },
          ]}
        >
          <Input
            prefix={<MdEmail className="text-stone-400 text-base" />}
            placeholder="email@ejemplo.com"
            className={inputClass}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
              Llave Secreta
            </span>
          }
          name="password"
          rules={[{ required: true, message: "Ingresa tu contraseña" }]}
        >
          <Input.Password
            prefix={<MdLock className="text-stone-400 text-base" />}
            placeholder="••••••••"
            className={inputClass}
            size="large"
          />
        </Form.Item>

        <div className="flex justify-end -mt-2 mb-4">
          <a
            href="#"
            className="text-xs font-semibold text-rose-700 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Form.Item>
          <Button
            htmlType="submit"
            block
            size="large"
            className="!bg-[#172c21] !border-[#172c21] !text-white !rounded-lg !font-['Playfair_Display'] !text-lg !font-semibold !shadow-md hover:!-translate-y-0.5 active:!scale-95 !transition-all !duration-300"
          >
            <span className="flex items-center justify-center gap-2">
              Comenzar Paseo <MdArrowForward className="text-xl" />
            </span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
