import React from "react";
import { Users, ArrowRight, MessageSquare } from "lucide-react";
import { getDoctors } from "@/utils/services/doctor";
import { getPatientById } from "@/utils/services/patient";
import { auth } from "@clerk/nextjs/server";
import { ProfileImage } from "@/components/profile-image";
import { BookAppointment } from "@/components/forms/book-appointment";
import Link from "next/link";

const PAGE_SIZE = 9;

function getFilteredDoctors(doctors: any[], search: string) {
  if (!search) return doctors;
  return doctors.filter((doc) =>
    doc.name?.toLowerCase().includes(search.toLowerCase())
  );
}

export default async function ProvidersPage({ searchParams }: { searchParams?: Promise<{ page?: string; search?: string }> }) {
  const { userId } = await auth();
  const { data: patient } = await getPatientById(userId!);
  const resolvedParams = searchParams ? await searchParams : {};
  const page = Number(resolvedParams.page || 1);
  const search = resolvedParams.search || "";
  const { data: doctors = [] } = await getDoctors();

  if (!patient) return null;

  const filteredDoctors = getFilteredDoctors(doctors, search);
  const totalPages = Math.ceil(filteredDoctors.length / PAGE_SIZE);
  const paginatedDoctors = filteredDoctors.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full min-h-screen bg-white py-10 px-2 md:px-8 lg:px-16 xl:px-32">
    
      {/* Search Input */}
      <form className="mb-8 flex justify-end" action="" method="get">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by name..."
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-700"
        />
        {/* Keep page param if present */}
        {page > 1 && <input type="hidden" name="page" value={page} />}
        <button type="submit" className="ml-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Search</button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {paginatedDoctors.map((doc: any) => (
          <div
            key={doc.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col gap-4 relative hover:shadow-blue-200 transition group"
          >
            <div className="flex items-center gap-4">
              <ProfileImage
                url={doc.img}
                name={doc.name}
                className="w-16 h-16 text-xl border-2 border-blue-400 shadow"
                textClassName="text-xl font-bold"
                bgColor={doc.colorCode || "#2563eb"}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-0.5">{doc.name}</h2>
                    <div className="text-gray-500 text-sm">{doc.specialization || "Doctor"}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="flex items-center gap-2 px-5 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold bg-transparent hover:bg-gray-100 transition">
                <MessageSquare className="w-4 h-4" /> Message
              </button>
              <BookAppointment data={patient} doctors={[doc]} />
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <Link
            href={`?search=${encodeURIComponent(search)}&page=${page - 1}`}
            className={`px-4 py-2 rounded-lg border font-semibold ${page <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"}`}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : 0}
          >
            Previous
          </Link>
          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>
          <Link
            href={`?search=${encodeURIComponent(search)}&page=${page + 1}`}
            className={`px-4 py-2 rounded-lg border font-semibold ${page >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"}`}
            aria-disabled={page >= totalPages}
            tabIndex={page >= totalPages ? -1 : 0}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
} 