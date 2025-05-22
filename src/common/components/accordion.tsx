"use client";
import { ReactNode, useState } from "react";
import Icons from "../icons/icons";


export default function Accordion({ title, children }: { title: string; children: ReactNode; }) {
  const [open, setOpen] = useState(false);

  const toggleAccordion = () => {
    setOpen(prev => !prev);
  };

  return (
    <div className="w-full mx-auto mb-10 mt-7">
      <div className="border border-border rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex items-center justify-between px-3 py-3 pl-4 bg-secondary cursor-pointer"
          onClick={toggleAccordion}
        >
          <h3 className="font-medium">{title}</h3>
          <button
            className="focus:outline-none transition-transform duration-200 ease-in-out"
            aria-expanded={open}
          >
            <Icons.ChevronRight
              className={`size-5 transform transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
            />
          </button>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-auto' : 'max-h-0'
          }`}
      >
        <div className="">
          {children}
        </div>
      </div>
    </div>
  );
}
