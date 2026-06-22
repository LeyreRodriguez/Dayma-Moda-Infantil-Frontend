import { Form, Input, Checkbox, Button, App } from "antd";
import { MdEmail, MdLock, MdAutoFixHigh } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";
import type { SignupRequest } from "../../types/auth";

const inputClass =
  "!rounded-lg !border-stone-200 !bg-white !text-sm !py-2 focus:!border-green-900 focus:!ring-1 focus:!ring-green-900/40 !shadow-[inset_2px_2px_8px_rgba(0,0,0,0.02)]";

export default function SignupForm() {
  const [form] = Form.useForm();
  const { signup } = useAuth();
  const { message } = App.useApp();

  const handleSignup = async (values: Record<string, unknown>) => {
    try {
      const { terms, ...payload } = values;
      await signup(payload as unknown as SignupRequest);
    } catch {
      message.error("Ocurrió un error al crear tu cuenta. Intenta de nuevo.");
    }
  };

  return (
    <div className="space-y-2">
      <header className="text-center mb-8">
        <h1 className="font-['Playfair_Display'] text-3xl font-semibold text-stone-800 mb-2">
          Crear tu Espacio
        </h1>
        <p className="text-stone-500 text-sm">Conviértete en parte de nuestra comunidad</p>
      </header>

      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSignup}>
        <Form.Item
          label={<span className="text-xs font-semibold tracking-widest uppercase text-stone-500">Tu Correo Mágico</span>}
          name="email"
          rules={[{ required: true, type: "email", message: "Ingresa un correo válido" }]}
        >
          <Input
            prefix={<MdEmail className="text-stone-400 text-base" />}
            placeholder="email@ejemplo.com"
            className={inputClass}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-semibold tracking-widest uppercase text-stone-500">Crea tu Llave</span>}
          name="password"
          rules={[{ required: true, min: 8, message: "Mínimo 8 caracteres" }]}
        >
          <Input.Password
            prefix={<MdLock className="text-stone-400 text-base" />}
            placeholder="Mínimo 8 caracteres"
            className={inputClass}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[{ validator: (_, v) => v ? Promise.resolve() : Promise.reject("Debes aceptar las condiciones") }]}
        >
          <Checkbox className="text-xs text-stone-500">
            Acepto las{" "}
            <a href="#" className="text-green-900 font-semibold underline">
              Reglas del Bosque
            </a>{" "}
            y Políticas de Privacidad.
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            block
            size="large"
            className="!bg-[#172c21] !border-[#172c21] !text-white !rounded-lg !font-['Playfair_Display'] !text-lg !font-semibold !shadow-md hover:!-translate-y-0.5 active:!scale-95 !transition-all !duration-300"
          >
            <span className="flex items-center justify-center gap-2">
              Unirme Ahora <MdAutoFixHigh className="text-xl" />
            </span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
