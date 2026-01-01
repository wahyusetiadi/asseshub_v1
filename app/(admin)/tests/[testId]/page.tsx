export default function TestDetailPage({
  params,
}: {
  params: { testId: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b pb-6">
        <h1 className="text-2xl font-bold">
          Edit Tes: <span className="text-blue-600">#{params.testId}</span>
        </h1>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
          Published
        </span>
      </div>

      <div className="p-10 bg-white border-2 border-dashed rounded-2xl text-center text-gray-400">
        Ini adalah halaman edit untuk ID: {params.testId}.
        <br />
        Anda bisa menggunakan kembali komponen dari halaman Create untuk mengisi
        data di sini.
      </div>
    </div>
  );
}
