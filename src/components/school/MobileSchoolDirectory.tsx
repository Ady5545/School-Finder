          return;
        }

        const suggestions = props.initialSchools
          .filter(school => isSafeStoredSchoolCoordinate(school.location?.coordinates))
          .filter(school => {
            const sector = String(school.location?.sector || '').trim().toLowerCase();
            return !new RegExp('^(?:sector|sec)\\s*[-\\/]?\\s*' + exactSector + '\\b', 'i').test(sector);
          })
          .map(school => {
            const coords = school.location.coordinates;
            if (!isSafeStoredSchoolCoordinate(coords)) return null;
            return {
              school,
              distanceKm: calculateDistance(target!.lat, target!.lng, coords.lat, coords.lng),
            };
          })
          .filter((item): item is NearbySuggestion => item !== null)
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 6);

        if (!controller.signal.aborted) setNearbySectorSuggestions(suggestions);
      } catch {
        if (!controller.signal.aborted) setNearbySectorSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setSectorSearchLoading(false);
      }
    }, 500);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [exactSector, props.filteredSchools.length, props.initialSchools]);

  const activeAreaLabel = useMemo(() => {
    if (props.selectedArea) return props.selectedArea;
    if (props.selectedProximityArea === 'my-location') return 'Near me';
    if (props.selectedProximityArea) {
      return POPULAR_PROXIMITY_AREAS.find(a => a.id === props.selectedProximityArea)?.sector || '';
    }
    return '';
  }, [props.selectedArea, props.selectedProximityArea]);

  const activeChips = [
    props.selectedBoard ? props.selectedBoard : null,
    props.selectedArea ? props.selectedArea : null,
    props.selectedAdmissionStatus !== 'all' ? 'Admissions' : null,
    props.selectedFeeTier !== 'all' ? 'Fee' : null,
    props.selectedGrade !== 'all' ? props.selectedGrade.replace('-', ' ') : null,
    props.selectedSports.length ? props.selectedSports.length + ' sport' + (props.selectedSports.length === 1 ? '' : 's') : null,
    props.siblingOnly ? 'Sibling' : null,
    props.selectedTrust !== 'all' ? 'Data check' : null,
  ].filter(Boolean) as string[];

  return (
    <div className="mobile-directory">
      <section className="mobile-directory-hero">
        <div className="mobile-directory-kicker">School discovery</div>
        <h1>Find schools that fit your family.</h1>
        <p>Search by school, sector, board, sports, fees or admissions.</p>

        <div className="mobile-directory-search">
          <Search className="w-[18px] h-[18px] shrink-0 text-[#183b5d]" />
          <input
            id="mobile-school-search"
            type="search"
            inputMode="search"
            autoComplete="off"
            value={props.searchQuery}
            onChange={e => props.setSearchQuery(e.target.value)}
            placeholder="Search schools, sectors, boards..."
            aria-label="Search schools"
          />
          {props.searchQuery && (
            <button type="button" onClick={() => props.setSearchQuery('')} aria-label="Clear search">
              <X className="w-[17px] h-[17px]" />
            </button>
          )}
        </div>

        <div className="mobile-directory-quick-scroll">
          <button type="button" className={cn('mobile-directory-chip', !props.selectedBoard && !props.selectedArea && props.activeFiltersCount === 0 && 'is-active')} onClick={props.resetAllFilters}>All schools</button>
          {props.distinctBoards.slice(0, 4).map(board => (
            <button type="button" key={board} className={cn('mobile-directory-chip', props.selectedBoard === board && 'is-active')} onClick={() => props.setSelectedBoard(props.selectedBoard === board ? '' : board)}>{board}</button>
          ))}
          <button type="button" className={cn('mobile-directory-chip', props.selectedAdmissionStatus === 'open' && 'is-active')} onClick={() => props.setSelectedAdmissionStatus(props.selectedAdmissionStatus === 'open' ? 'all' : 'open')}>Admissions open</button>
          <button type="button" className="mobile-directory-chip" onClick={props.handleNearMe}><LocateFixed className="w-3.5 h-3.5" /> Near me</button>
        </div>
      </section>

      <section className="mobile-directory-toolbar">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[13px] font-black text-[#102238]">{props.filteredSchools.length} {props.filteredSchools.length === 1 ? 'school' : 'schools'}</span>
          {activeAreaLabel && <span className="mobile-directory-context"><MapPin className="w-3 h-3" /> {activeAreaLabel}</span>}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className={cn('mobile-directory-tool', props.showMap && 'is-active')} onClick={() => props.setShowMap(!props.showMap)}>
            <MapPin className="w-4 h-4" /> Map
          </button>
          <button type="button" className={cn('mobile-directory-tool', props.activeFiltersCount > 0 && 'is-active')} onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal className="w-4 h-4" /> Filter{props.activeFiltersCount > 0 ? ' · ' + props.activeFiltersCount : ''}
          </button>
        </div>
      </section>

      {activeChips.length > 0 && (
        <div className="mobile-directory-active-scroll">
          {activeChips.map((chip, index) => (
            <span key={chip + index} className="mobile-directory-active-chip">{chip}</span>
          ))}
          <button type="button" onClick={props.resetAllFilters} className="mobile-directory-clear">Clear all</button>
        </div>
      )}

      {props.showMap && (
        <section className="mobile-directory-map">
          <DirectoryInteractiveMap
            schools={props.filteredSchools.length ? props.filteredSchools : props.initialSchools}
            selectedProximityArea={props.selectedProximityArea}
            selectedRadiusKm={props.selectedRadiusKm}
            onProximityChange={props.handleProximityChange}
            activeSchoolSlug={props.activeMapSchoolSlug}
            onSelectSchool={school => props.setActiveMapSchoolSlug(school.slug)}
            onClose={() => props.setShowMap(false)}
          />
        </section>
      )}

      <section className="mobile-directory-results">
        {props.filteredSchools.length > 0 ? (
          <div className="mobile-directory-card-list">
            {props.filteredSchools.map(school => <SchoolCard key={school.id} school={school} />)}
          </div>
        ) : nearbySectorSuggestions.length > 0 ? (
          <div className="mobile-directory-empty">
            <div className="mobile-directory-empty-icon"><Sparkles className="w-5 h-5" /></div>
            <h2>No exact match — nearby schools are below.</h2>
            <p>We could not find a listed school in that exact sector.</p>
            <div className="mobile-directory-nearby">
              {nearbySectorSuggestions.map(item => (
                <Link key={item.school.id} href={'/schools/' + item.school.slug} className="mobile-nearby-row">
                  <div className="min-w-0">
                    <strong>{item.school.name}</strong>
                    <span>{item.school.location.sector || item.school.location.area}</span>
                  </div>
                  <span>{item.distanceKm} km <ChevronRight className="w-4 h-4" /></span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mobile-directory-empty">
            <div className="mobile-directory-empty-icon"><Search className="w-5 h-5" /></div>
            <h2>{sectorSearchLoading ? 'Finding nearby schools…' : 'No schools match these filters.'}</h2>
            <p>{sectorSearchLoading ? 'Checking the requested sector and nearby verified campuses.' : 'Try a broader search or remove one filter.'}</p>
            <button type="button" onClick={props.resetAllFilters} className="mobile-directory-reset">Reset filters</button>
          </div>
        )}

        <div className="mobile-directory-sort">
          <div className="mobile-sort-label"><ArrowUpDown className="w-3.5 h-3.5" /> Sort results</div>
          <select value={props.sortBy} onChange={e => props.setSortBy(e.target.value as 'featured' | 'name' | 'fee-asc' | 'fee-desc' | 'rating' | 'distance')}>
            <option value="featured">Featured</option>
            {props.proximityCoords && <option value="distance">Nearest first</option>}
            <option value="rating">Top rated</option>
            <option value="name">Name A–Z</option>