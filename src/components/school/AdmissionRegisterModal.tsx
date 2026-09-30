    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleModalClose}
      side="right"
      title={isPreReg ? 'Pre-registration request' : 'Admission request'}
      className="w-full sm:max-w-xl bg-white p-0 rounded-l-3xl"
    >
      <div className="px-5 pb-6 sm:px-6 sm:pb-7 space-y-4">
        {isSuccess ? (
          /* Confirmation State */
          <div className="py-6 text-center space-y-4 my-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 id="admission-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isPreReg ? 'Pre-Registration Confirmed' : 'Registration Received'}
            </h2>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2 text-left">
              <p className="font-semibold text-slate-900">
                {isPreReg
                  ? `Your pre-registration request for ${school.name} has reached Admission Pitara.`
                  : `Your admission request for ${school.name} has reached Admission Pitara.`}
              </p>
              <p className="text-slate-700 leading-relaxed">
                Our team will follow up with the school using the details you provided and keep the request connected to this school.
              </p>
              <div className="pt-2 border-t border-emerald-200 text-[11px] text-emerald-800 font-medium">
                Request received by Admission Pitara • School follow-up handled by our team
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleModalClose}
              className="w-full font-bold mt-2"
            >
              Done
            </Button>
          </div>
        ) : (
          /* Registration Form */
          <div className="overflow-y-auto pr-1 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admission Pitara Parent Guidance</span>
              </div>
              <h2 id="admission-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {isPreReg ? 'Pre-register for 2027–28' : 'Send an Admission Request'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Target Institution: <span className="font-bold text-slate-800">{school.name}</span>
              </p>
            </div>

            {/* Scope / Transparency Banner */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-[11.5px] text-amber-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Admission enquiry handled by Admission Pitara</span>
              </div>
              <p className="leading-relaxed">
                Send your request here and our team receives it at the Admission Pitara enquiry desk. We then follow up with the school directly on your behalf.