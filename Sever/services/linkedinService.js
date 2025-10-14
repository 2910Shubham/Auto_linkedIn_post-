import axios from 'axios';
import FormData from 'form-data';

class LinkedInService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://api.linkedin.com/v2';
  }

  // Get user's LinkedIn profile ID using OpenID Connect
  async getUserProfile() {
    try {
      const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error.response?.data || error.message);
      throw error;
    }
  }

  // Upload image to LinkedIn
  async uploadImage(imageBuffer, filename) {
    try {
      // Step 1: Register upload
      const profile = await this.getUserProfile();
      const personURN = `urn:li:person:${profile.sub}`;

      const registerResponse = await axios.post(
        `${this.baseURL}/assets?action=registerUpload`,
        {
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: personURN,
            serviceRelationships: [
              {
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent',
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = registerResponse.data.value.asset;

      // Step 2: Upload image binary
      await axios.put(uploadUrl, imageBuffer, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/octet-stream',
        },
      });

      return asset;
    } catch (error) {
      console.error('Error uploading image to LinkedIn:', error.response?.data || error.message);
      throw error;
    }
  }

  // Create a text post
  async createTextPost(text) {
    try {
      const profile = await this.getUserProfile();
      const personURN = `urn:li:person:${profile.sub}`;

      const postData = {
        author: personURN,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      const response = await axios.post(`${this.baseURL}/ugcPosts`, postData, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating LinkedIn text post:', error.response?.data || error.message);
      throw error;
    }
  }

  // Create a post with image
  async createImagePost(text, imageBuffer, filename) {
    try {
      const profile = await this.getUserProfile();
      const personURN = `urn:li:person:${profile.sub}`;

      // Upload image first
      const asset = await this.uploadImage(imageBuffer, filename);

      const postData = {
        author: personURN,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text,
            },
            shareMediaCategory: 'IMAGE',
            media: [
              {
                status: 'READY',
                media: asset,
              },
            ],
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      };

      const response = await axios.post(`${this.baseURL}/ugcPosts`, postData, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating LinkedIn image post:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default LinkedInService;
