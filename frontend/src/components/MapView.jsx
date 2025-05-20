import React, { useState, useEffect, useRef } from 'react';

// Coordenadas centrais de Santa Maria, RS
const SANTA_MARIA_COORDS = [-29.6914, -53.8008];
const DEFAULT_ZOOM = 15;

const MapView = ({ selectedOption }) => {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);
    const markersRef = useRef([]);

    // Inicializa o mapa
    useEffect(() => {
        if (!leafletMapRef.current && mapRef.current) {
            leafletMapRef.current = L.map(mapRef.current).setView(SANTA_MARIA_COORDS, DEFAULT_ZOOM);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(leafletMapRef.current);
        }

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
        };
    }, []);

    // Atualiza localizações com base na opção selecionada
    useEffect(() => {
        // Limpa os marcadores existentes
        if (markersRef.current.length > 0) {
            markersRef.current.forEach((marker) => marker.remove());
            markersRef.current = [];
        }

        if (!selectedOption) {
            setLocations([]);
            return;
        }

        const fetchLocations = async () => {
            setIsLoading(true);
            try {
                setTimeout(() => {
                    let mockLocations = [];

                    switch (selectedOption.type) {
                        case 'anxiety':
                            mockLocations = [
                                { 
                                    id: 1, 
                                    name: 'Clínica Equilíbrio Mental', 
                                    lat: -29.685, 
                                    lng: -53.812, 
                                    address: 'R. dos Andradas, 1234', 
                                    phone: '(55) 3222-1234', 
                                    specialty: 'Ansiedade e Transtornos de Ansiedade',
                                    description: 'Especializada em tratamentos para transtornos de ansiedade utilizando abordagens integrativas.'
                                },
                                { 
                                    id: 2, 
                                    name: 'Consultório Dra. Maria Silva', 
                                    lat: -29.692, 
                                    lng: -53.816, 
                                    address: 'Av. Rio Branco, 567', 
                                    phone: '(55) 3222-5678', 
                                    specialty: 'Terapia Cognitivo-Comportamental para Ansiedade',
                                    description: 'Atendimento individualizado com foco em TCC, especialista em transtornos de ansiedade.'
                                },
                                { 
                                    id: 3, 
                                    name: 'Instituto Mente Sã', 
                                    lat: -29.6795, 
                                    lng: -53.8076, 
                                    address: 'R. Venâncio Aires, 890', 
                                    phone: '(55) 3222-8901', 
                                    specialty: 'Ansiedade e Pânico',
                                    description: 'Equipe multidisciplinar com psiquiatras e psicólogos especializados em crises de ansiedade.'
                                },
                            ];
                            break;
                        case 'depression':
                            mockLocations = [
                                { 
                                    id: 1, 
                                    name: 'Centro de Tratamento da Depressão', 
                                    lat: -29.6872, 
                                    lng: -53.8201, 
                                    address: 'Av. Medianeira, 2345', 
                                    phone: '(55) 3221-2345', 
                                    specialty: 'Tratamento de Depressão e Distimia',
                                    description: 'Tratamentos inovadores para depressão, incluindo TMS (Estimulação Magnética Transcraniana).'
                                },
                                { 
                                    id: 2, 
                                    name: 'Consultório Dr. Carlos Mendes', 
                                    lat: -29.6814, 
                                    lng: -53.8112, 
                                    address: 'R. Alberto Pasqualini, 678', 
                                    phone: '(55) 3221-6789', 
                                    specialty: 'Psiquiatria - Depressão',
                                    description: 'Psiquiatra com 15 anos de experiência em tratamento de depressão refratária e recorrente.'
                                },
                            ];
                            break;
                        case 'stress':
                            mockLocations = [
                                { 
                                    id: 1, 
                                    name: 'Espaço Anti-Estresse', 
                                    lat: -29.6913, 
                                    lng: -53.8050, 
                                    address: 'R. Dr. Bozano, 1122', 
                                    phone: '(55) 3220-1122', 
                                    specialty: 'Manejo de Estresse e Burnout',
                                    description: 'Centro especializado em técnicas de redução de estresse, meditação e terapias complementares.'
                                },
                                { 
                                    id: 2, 
                                    name: 'Clínica Renascer', 
                                    lat: -29.6791, 
                                    lng: -53.8189, 
                                    address: 'Av. Nossa Senhora das Dores, 1500', 
                                    phone: '(55) 3220-1500', 
                                    specialty: 'Estresse e Saúde Mental',
                                    description: 'Abordagem holística para manejo do estresse, combinando terapias psicológicas e práticas integrativas.'
                                },
                            ];
                            break;
                        default:
                            mockLocations = [];
                    }

                    setLocations(mockLocations);

                    if (leafletMapRef.current && mockLocations.length > 0) {
                        // Criando um ícone personalizado para os marcadores
                        const customIcon = L.divIcon({
                            className: 'custom-div-icon',
                            html: `<div class="marker-pin"></div>`,
                            iconSize: [30, 42],
                            iconAnchor: [15, 42]
                        });

                        mockLocations.forEach((location) => {
                            // Criando o marcador com ícone personalizado
                            const marker = L.marker([location.lat, location.lng], {
                                icon: customIcon,
                                title: location.name // Isso mostra um tooltip simples ao passar o mouse
                            }).addTo(leafletMapRef.current);
                            
                            // Adicionando um tooltip mais elaborado que aparece ao passar o mouse
                            marker.bindTooltip(`
                                <div class="custom-tooltip">
                                    <strong>${location.name}</strong>
                                    <p>${location.description}</p>
                                </div>
                            `, {
                                direction: 'top',
                                offset: [0, -20],
                                className: 'custom-tooltip-class'
                            });
                            
                            // Adicionando um popup que aparece ao clicar
                            marker.bindPopup(`
                                <div class="custom-popup">
                                    <h3>${location.name}</h3>
                                    <p><strong>Endereço:</strong> ${location.address}</p>
                                    <p><strong>Telefone:</strong> ${location.phone}</p>
                                    <p><strong>Especialidade:</strong> ${location.specialty}</p>
                                    <p><strong>Descrição:</strong> ${location.description}</p>
                                </div>
                            `, {
                                maxWidth: 300,
                                className: 'custom-popup-class'
                            });

                            // Eventos para melhorar a interação
                            marker.on('mouseover', function(e) {
                                this.openTooltip();
                            });
                            
                            marker.on('click', function(e) {
                                this.openPopup();
                            });

                            markersRef.current.push(marker);
                        });

                        // Ajusta a visualização para mostrar todos os marcadores
                        if (mockLocations.length > 1) {
                            const group = new L.featureGroup(markersRef.current);
                            leafletMapRef.current.fitBounds(group.getBounds().pad(0.1));
                        } else if (mockLocations.length === 1) {
                            leafletMapRef.current.setView([mockLocations[0].lat, mockLocations[0].lng], 15);
                        }
                    }

                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error('Erro ao buscar localizações:', error);
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, [selectedOption]);

    return (
        <div className="bg-white rounded-lg shadow-md flex-1 overflow-hidden relative">
            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                    <div className="text-blue-500 text-lg font-medium">Carregando locais...</div>
                </div>
            )}

            <div className="h-full" style={{ position: 'relative', zIndex: 1 }}>
                <div ref={mapRef} className="w-full h-full"></div>
            </div>

            {!selectedOption && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-90 flex items-center justify-center p-6 z-20">
                    <div className="text-center max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Encontre ajuda em Santa Maria</h3>
                        <p className="text-gray-600">
                            Selecione um problema de saúde mental no painel ao lado para ver os locais de atendimento disponíveis em Santa Maria/RS.
                        </p>
                    </div>
                </div>
            )}

            {selectedOption && locations.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4 z-20 max-h-48 overflow-y-auto">
                    <h3 className="text-lg font-bold mb-2">Locais para tratamento de {selectedOption.name} ({locations.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {locations.map((location) => (
                            <div 
                                key={location.id} 
                                className="text-sm bg-white p-2 rounded shadow-sm border border-gray-200 hover:bg-blue-50 cursor-pointer transition"
                                onClick={() => {
                                    // Centraliza o mapa nesta localização quando clicada
                                    if (leafletMapRef.current) {
                                        leafletMapRef.current.setView([location.lat, location.lng], 16);
                                        // Encontra e abre o popup do marcador correspondente
                                        markersRef.current.forEach(marker => {
                                            const markerLatLng = marker.getLatLng();
                                            if (markerLatLng.lat === location.lat && markerLatLng.lng === location.lng) {
                                                marker.openPopup();
                                            }
                                        });
                                    }
                                }}
                            >
                                <strong className="text-blue-600 block">{location.name}</strong>
                                <p className="text-gray-600 truncate">{location.address}</p>
                                <p className="text-gray-600">{location.phone}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapView;
