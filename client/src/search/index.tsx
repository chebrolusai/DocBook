import React, { useState, useEffect } from "react";
import SearchForm from "../components/SearchForm";
import DoctorProfile from "../components/DoctorProfile";
import DoctorMap from "../components/DoctorMap";
import { searchDoctors } from "../api";
import { SearchCriteria, Doctor } from "../types/DoctorTypes";
import DocBookHeader from "../components/DocBookHeader";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";


const DoctorSearchPage: React.FC = () => {
    const location = useLocation();
    const initialSearchCriteria = location.state?.searchCriteria;
    const [doctorProfiles, setDoctorProfiles] = useState<Doctor[]>([]);

    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | undefined>(initialSearchCriteria);

    const handleSearchSubmit = (criteria: SearchCriteria) => {
        setSearchCriteria(criteria);
        searchDoctors(criteria)
            .then((data) => setDoctorProfiles(data))
            .catch((error) => console.error("Error:", error));
    };

    useEffect(() => {
        if (initialSearchCriteria) {
            searchDoctors(initialSearchCriteria)
                .then((data) => setDoctorProfiles(data))
                .catch((error) => console.error("Error:", error));
        }
    }, [initialSearchCriteria]);

    return (
        <>
            <div className="container-fluid customContainerFluid">
                <div className="row">
                    <div className="col-7" id="search-container">
                        <DocBookHeader></DocBookHeader>
                        <SearchForm
                            onSearchSubmit={handleSearchSubmit}
                            initialCriteria={searchCriteria}
                        />
                        <div id="search-results">
                            <DoctorProfile doctors={doctorProfiles} />
                        </div>
                    </div>
                    <div className="col-5 p-1" id="map">
                        <DoctorMap doctors={doctorProfiles} />
                    </div>

                </div>
            </div>
            <Footer></Footer>
        </>
    );
};

export default DoctorSearchPage;
