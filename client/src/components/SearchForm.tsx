import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospital, faSearch, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";

interface SearchFormProps {
    onSearchSubmit: (data: { name: string; specialty: string; location: string }) => void;
    initialCriteria?: { name: string; specialty: string; location: string }; // Added initialCriteria
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearchSubmit, initialCriteria }) => {
    const [name, setName] = useState<string>('');
    const [specialty, setSpecialty] = useState<string>('');
    const [location, setLocation] = useState<string>('');

    // useEffect to initialize state with initialCriteria
    useEffect(() => {
        if (initialCriteria) {
            setName(initialCriteria.name);
            setSpecialty(initialCriteria.specialty);
            setLocation(initialCriteria.location);
        }
    }, [initialCriteria]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearchSubmit({ name, specialty, location });
    };

    const { t, i18n, ready } = useTranslation("common", { useSuspense: false });

    return (
        <form onSubmit={handleSubmit}>
            <div className='uppertext'>{t("home.page.title")}</div>
            <div className='searchframe'>
                <div className="search-bar width-adj">
                    <div className="search-icon">
                        <FontAwesomeIcon icon={faSearch} />
                    </div>

                    <input
                        type="text"
                        className="mb-2"
                        value={location}
                        placeholder="Location"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                    />

                    <div className="search-icon">
                        <FontAwesomeIcon icon={faHospital} />
                    </div>

                    <input
                        type="text"
                        className="mb-2"
                        value={specialty}
                        placeholder="Specialty"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSpecialty(e.target.value)}
                    />
                    <div className="search-icon">
                        <FontAwesomeIcon icon={faUserDoctor} />
                    </div>
                    <input
                        type="text"
                        className="mb-2"
                        value={name}
                        placeholder="Name"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />


                    <button className="btn btn-primary search-btn"><FontAwesomeIcon icon={faSearch} /></button>
                </div>
            </div>

            {/* <div className="search-bar">
            <input
            type="text"
            className="form-control mb-2"
            placeholder="Location"
            name="location"
            value={searchParams.location}
            onChange={handleSearchChange}
            />
            <input
            type="text"
            className="form-control mb-2"
            placeholder="Specialty"
            name="specialty"
            value={searchParams.specialty}
            onChange={handleSearchChange}
            />
            <input
            type="text"
            className="form-control mb-2"
            placeholder="Insurance"
            name="insurance"
            value={searchParams.insurance}
            onChange={handleSearchChange}
            />
            <button className="btn btn-primary search-btn">Search</button>
        </div> */}
        </form>
    );
};

export default SearchForm;
