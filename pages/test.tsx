import Calendar from "@/components/Calendar";

export default function Test() {
  return (
    <Calendar
      data={[{ date: "2025-01-01", count: 1, value: 0.5 }]}
      year={2025}
    />
  );
}
