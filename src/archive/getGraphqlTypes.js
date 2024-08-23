// Helper function to map JSON fields to GraphQL types
const getGraphQLType = (field) => {
	const typeMap = {
		ceterms_accreditedBy: 'Organization',
		ceterms_accreditedIn: 'Jurisdiction',
		ceterms_administrationProcess: 'Process',
		// Add more specific mappings as needed
		ceterms_versionIdentifier: 'String',
		ceterms_name: 'String',
		ceterms_subject: '[String]',
		ceterms_subjectWebpage: 'URL',
		ceterms_image: 'URL',
		ceterms_description: 'String',
		// Default fallback
	};
	return typeMap[field] || 'String'; // Default to String if not found
};
