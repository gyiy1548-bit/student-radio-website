import React, { useMemo, useState } from 'react';
import { Calendar, Filter, Printer, RefreshCw } from 'lucide-react';

type ViewFilter = 'all' | 'primary' | 'reserve';

const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const primaryRoles = ['المقدمة', 'القرآن الكريم', 'الحديث الشريف', 'كلمة الصباح', 'الحكمة'];
const reserveRoles = [
  'مقدمة (احتياط)',
  'قرآن (احتياط)',
  'كلمة صباح (احتياط)',
  'حكمة (احتياط)',
  'هل تعلم (احتياط)',
];

export function WeeklySchedule() {
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [seed, setSeed] = useState(0);
  
  // قائمة الطلاب (يمكنك إضافة أو تعديل الأسماء هنا بكل حرية)
  const [studentsList] = useState<string[]>([
    'طالب 1',
    'طالب 2',
    'طالب 3',
    'طالب 4',
    'طالب 5',
    'طالب 6',
    'طالب 7',
    'طالب 8',
    'طالب 9',
    'طالب 10',
  ]);

  const scheduleData = useMemo(() => {
    if (studentsList.length === 0) {
      return days.map((day) => ({ day, primary: [], reserve: [] }));
    }

    let currentIndex = seed * 7; // لتغيير توزيع الأسماء عند الضغط على إعادة التوزيع

    return days.map((day) => {
      // نأخذ نسخة مختلطة أو مرتبة من الطلاب ونختار منها بدون تكرار في نفس اليوم قدر الإمكان
      const dayStudents = [...studentsList].sort(() => Math.sin(seed + currentIndex) - 0.5);
      
      let studentCursor = 0;
      const getNextStudent = () => {
        const student = dayStudents[studentCursor % dayStudents.length];
        studentCursor++;
        return student;
      };

      return {
        day,
        primary: primaryRoles.map((role) => ({
          role,
          student: getNextStudent(),
        })),
        reserve: reserveRoles.map((role) => ({
          role,
          student: getNextStudent(),
        })),
      };
    });
  }, [seed, studentsList]);

  return (
    <section dir="rtl" className="mx-auto max-w-6xl rounded-xl bg-slate-900 p-6 text-white shadow-xl">
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-700 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Calendar className="text-blue-400" aria-hidden="true" />
            جدول الإذاعة المدرسية
          </h2>
          <p className="mt-1 text-sm text-slate-400">توزيع الأدوار الأساسية والاحتياطية على أيام الأسبوع بدون تكرار الطلاب في اليوم الواحد</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm">
            <Filter size={16} className="text-blue-300" aria-hidden="true" />
            <span className="sr-only">تصفية الفقرات</span>
            <select
              value={viewFilter}
              onChange={(event) => setViewFilter(event.target.value as ViewFilter)}
              className="bg-transparent text-white outline-none"
              aria-label="تصفية الفقرات"
            >
              <option className="bg-slate-800" value="all">الكل</option>
              <option className="bg-slate-800" value="primary">الأساسي فقط</option>
              <option className="bg-slate-800" value="reserve">الاحتياط فقط</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => setSeed((current) => current + 1)}
            className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-600"
          >
            <RefreshCw size={16} aria-hidden="true" /> إعادة التوزيع
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500"
          >
            <Printer size={16} aria-hidden="true" /> طباعة الجدول
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {scheduleData.map(({ day, primary, reserve }) => (
          <article key={day} className="rounded-lg border border-slate-700 bg-slate-800 p-4">
            <h3 className="mb-4 rounded-md border border-blue-500/30 bg-blue-600/20 py-2 text-center font-bold text-blue-300">
              {day}
            </h3>

            {(viewFilter === 'all' || viewFilter === 'primary') && (
              <section aria-label={`الفقرات الأساسية ليوم ${day}`}>
                <h4 className="mb-2 text-xs font-semibold text-emerald-400">الفقرات الأساسية</h4>
                <div className="space-y-2">
                  {primary.map(({ role, student }) => (
                    <div key={role} className="rounded border border-slate-700/50 bg-slate-900/60 p-2 text-sm">
                      <span className="block text-xs text-slate-400">{role}</span>
                      <span className="font-medium text-emerald-400">{student}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(viewFilter === 'all' || viewFilter === 'reserve') && (
              <section className={viewFilter === 'all' ? 'pt-4' : ''} aria-label={`فقرات الاحتياط ليوم ${day}`}>
                <h4 className="mb-2 text-xs font-semibold text-amber-400">الاحتياط</h4>
                <div className="space-y-2">
                  {reserve.map(({ role, student }) => (
                    <div key={role} className="rounded border border-slate-700/50 bg-slate-900/40 p-2 text-sm">
                      <span className="block text-xs text-slate-500">{role}</span>
                      <span className="font-medium text-amber-300">{student}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
