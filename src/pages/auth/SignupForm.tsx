import { Form, Input, Checkbox, Button, App, Modal } from "antd";
import { MdEmail, MdLock, MdPerson, MdAutoFixHigh } from "react-icons/md";
import { useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { SignupRequest } from "../../types/auth";

const inputClass =
  "!rounded-lg !border-stone-200 !bg-white !text-sm !py-3 focus:!border-green-900 focus:!ring-1 focus:!ring-green-900/40 !shadow-[inset_2px_2px_8px_rgba(0,0,0,0.02)]";

export default function SignupForm() {
  const [form] = Form.useForm();
  const { signup, login } = useAuth();
  const { message } = App.useApp();
  const [verifiedModalOpen, setVerifiedModalOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [lastEmail, setLastEmail] = useState("");
  const [lastPassword, setLastPassword] = useState("");
  const isChecking = useRef(false);

  const handleSignup = async (values: Record<string, unknown>) => {
    try {
      const { terms, ...payload } = values;
      setLastEmail(payload.email as string);
      setLastPassword(payload.password as string);
      await signup(payload as unknown as SignupRequest);
      setVerificationError(false);
      setVerifiedModalOpen(true);
      form.resetFields();
    } catch {
      message.error("Ocurrió un error al crear tu cuenta. Intenta de nuevo.");
    }
  };

  const checkVerification = async () => {
    if (isChecking.current) return;
    isChecking.current = true;
    setChecking(true);
    setVerificationError(false);
    try {
      await login({ email: lastEmail, password: lastPassword });
    } catch {
      setVerificationError(true);
      setChecking(false);
      isChecking.current = false;
    }
  };

  return (
    <div className="space-y-2">
      <header className="text-center mb-8">
        <h1 className="font-['Playfair_Display'] text-3xl font-semibold text-stone-800 mb-2">
          Crear tu Espacio
        </h1>
        <p className="text-stone-500 text-sm">
          Conviértete en parte de nuestra comunidad
        </p>
      </header>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleSignup}
      >
        <Form.Item
          label={
            <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
              Nombre y apellidos
            </span>
          }
          name="name"
          rules={[
            {
              required: true,
              type: "string",
              message: "Ingresa tu nombre y apellidos",
            },
          ]}
        >
          <Input
            prefix={<MdPerson className="text-stone-400 text-base" />}
            placeholder="John Doe"
            className={inputClass}
            size="large"
          />
        </Form.Item>
        <Form.Item
          label={
            <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
              Tu Correo
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
              Crea tu Contraseña
            </span>
          }
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
          rules={[
            {
              validator: (_, v) =>
                v
                  ? Promise.resolve()
                  : Promise.reject("Debes aceptar las condiciones"),
            },
          ]}
        >
          <Checkbox className="text-xs text-stone-500">
            Acepto las{" "}
            <a href="#" className="text-green-900 font-semibold underline">
              Reglas
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

      <Modal
        open={verifiedModalOpen}
        onCancel={() => setVerifiedModalOpen(false)}
        footer={null}
        centered
        width={400}
        title={
          <span className="font-headline-md text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">mark_email_unread</span>
            Verifica tu cuenta
          </span>
        }
      >
        <div className="py-4 text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-primary">
            mail_outline
          </span>
          <p className="font-body-md text-on-surface-variant">
            Tu cuenta se ha creado correctamente.
            <br />
            Revisa tu correo electrónico para verificar tu cuenta antes de iniciar sesión.
          </p>
          {verificationError && (
            <p className="font-body-md text-red-600 bg-red-50 rounded-lg p-3">
              Aún no has verificado tu cuenta. Revisa tu correo electrónico y haz clic en el enlace de verificación.
            </p>
          )}
          <button
            onClick={checkVerification}
            disabled={checking}
            className="w-full mt-4 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {checking ? "Comprobando..." : "Comprobar verificación"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
