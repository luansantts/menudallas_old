import { addDays, setHours, setMinutes, format } from "date-fns";

// Helper para construir um Date do "hoje" com HH:mm fornecido
function buildTimeToday(timeHHmm) {
  const [hh = "00", mm = "00"] = String(timeHHmm || "00:00").split(":");
  let d = new Date();
  d = setHours(d, Number(hh));
  d = setMinutes(d, Number(mm));
  return d;
}

function isDayEnabled(dayIndexString, dt) {
  return (
    (dayIndexString === "1" && dt.abre_segunda) ||
    (dayIndexString === "2" && dt.abre_terca) ||
    (dayIndexString === "3" && dt.abre_quarta) ||
    (dayIndexString === "4" && dt.abre_quinta) ||
    (dayIndexString === "5" && dt.abre_sexta) ||
    (dayIndexString === "6" && dt.abre_sabado) ||
    (dayIndexString === "7" && dt.abre_domingo)
  );
}

export const getOpened = (dt) => {
  if (!dt) return false;
  if (dt.emPausa) return false;

  const now = new Date();
  const todayIndex = format(now, "i"); // 1 (seg) .. 7 (dom)

  // Horários de hoje
  const openToday = buildTimeToday(dt.hora_abre);
  const closeToday = buildTimeToday(dt.hora_fecha);

  const spansMidnight = closeToday <= openToday;

  // Ajuste de janelas que viram a madrugada:
  // - Se fecha no dia seguinte, move o close para +1 dia
  // - Se agora está antes da hora de abrir e a janela vira, o open pertence a ontem
  let open = openToday;
  let close = spansMidnight ? addDays(closeToday, 1) : closeToday;

  if (spansMidnight && now < openToday) {
    open = addDays(openToday, -1);
  }

  // O dia a considerar para a flag de abertura é o dia do "open" calculado
  const openDayIndex = format(open, "i");
  const dayEnabled = isDayEnabled(openDayIndex, dt);

  return dayEnabled && now >= open && now <= close;
};
