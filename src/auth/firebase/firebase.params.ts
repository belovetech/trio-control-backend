import { ConfigService } from '@nestjs/config';

const firebase_params = (config: ConfigService) => {
  const firebase = config.get('firebase');
  return {
    type: firebase.type,
    projectId: firebase.project_id,
    privateKeyId: firebase.private_key_id,
    privateKey: firebase.private_key,
    clientEmail: firebase.client_email,
    clientId: firebase.client_id,
    authUri: firebase.auth_uri,
    tokenUri: firebase.token_uri,
    authProviderX509CertUrl: firebase.auth_provider_x509_cert_url,
    clientC509CertUrl: firebase.client_x509_cert_url,
  };
};

export default firebase_params;
