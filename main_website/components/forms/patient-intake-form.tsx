import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UploadCloud } from "lucide-react";

const intakeSchema = z.object({
  chiefComplaint: z.string().min(2, "Required"),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  pastConditions: z.string().optional(),
  bp: z.string().optional(),
  temp: z.string().optional(),
  pharmacyName: z.string().optional(),
  pharmacyAddress: z.string().optional(),
  pharmacyPhone: z.string().optional(),
  insurance: z.enum(["yes", "no"]).optional(),
  insuranceId: z.string().optional(),
  attachments: z.any().optional(),
});

type IntakeFormValues = z.infer<typeof intakeSchema>;

export const PatientIntakeForm = ({ onNext }: { onNext: (data: IntakeFormValues) => void }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<IntakeFormValues>({
    resolver: zodResolver(intakeSchema),
  });
  const insurance = watch("insurance");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(files);
    setValue("attachments", files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(
      (file) => ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
    );
    setSelectedFiles(files);
    setValue("attachments", files);
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="max-w-2xl mx-auto bg-white/90 rounded-2xl shadow-2xl border border-emerald-100 p-8 space-y-8 animate-fadeInUp">
      <div>
        <h2 className="text-2xl font-extrabold text-emerald-700 mb-1 flex items-center gap-2">
          Patient Intake Form
        </h2>
        <p className="text-gray-500 mb-4 text-base">Please fill out this form to help us provide you with tailored and effective healthcare services.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-semibold text-gray-700">Reason for today's visit</label>
          <input {...register("chiefComplaint")} className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-base" placeholder="Chief Complaint" />
          {errors.chiefComplaint && <span className="text-red-500 text-xs">{errors.chiefComplaint.message}</span>}
        </div>
        <div>
          <label className="font-semibold text-gray-700">Allergies</label>
          <input {...register("allergies")} className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-base" placeholder="List allergies and reactions" />
        </div>
        <div>
          <label className="font-semibold text-gray-700">Current Medications</label>
          <input {...register("medications")} className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-base" placeholder="List current medications" />
        </div>
        <div>
          <label className="font-semibold text-gray-700">Past Medical Conditions</label>
          <input {...register("pastConditions")} className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-base" placeholder="List past conditions" />
        </div>
        <div>
          <label className="font-semibold text-gray-700">Last BP Reading & Date</label>
          <input {...register("bp")} className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-base" placeholder="e.g. 120/80, 2023-05-01" />
        </div>
        <div>
          <label className="font-semibold text-gray-700">Last Temp & Date</label>
          <input {...register("temp")} className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-base" placeholder="e.g. 98.6°F, 2023-05-01" />
        </div>
        <div>
          <label className="font-semibold text-gray-700">Preferred Pharmacy</label>
          <input {...register("pharmacyName")} className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 text-base" placeholder="Pharmacy Name" />
          <input {...register("pharmacyAddress")} className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 mt-2 text-base" placeholder="Pharmacy Address" />
          <input {...register("pharmacyPhone")} className="w-full mt-1 rounded-lg border border-gray-200 px-3 py-2 mt-2 text-base" placeholder="Pharmacy Phone" />
        </div>
        <div>
          <label className="font-semibold text-gray-700">Do you have insurance?</label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center gap-2">
              <input type="radio" value="yes" {...register("insurance")} /> Yes
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="no" {...register("insurance")} /> No
            </label>
          </div>
          {insurance === "yes" && (
            <input {...register("insuranceId")} className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2 text-base" placeholder="Member ID or Group ID" />
          )}
        </div>
      </div>
      <div>
        <label className="font-semibold text-gray-700 mb-2 block">Attachments</label>
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50/40 p-6 cursor-pointer hover:bg-emerald-100 transition"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <UploadCloud className="w-10 h-10 text-emerald-400 mb-2" />
          <span className="text-gray-600 font-medium">Drag & drop files here, or <span className="underline text-emerald-600">browse</span></span>
          <span className="text-xs text-gray-500 mt-1">Only image files (jpg, png) or PDF documents are accepted.</span>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
          />
        </div>
        {selectedFiles.length > 0 && (
          <div className="mt-3 space-y-1">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                <span className="inline-block w-4 h-4 bg-emerald-200 rounded-full" />
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <Button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-emerald-700 transition text-lg">Next</Button>
    </form>
  );
}; 