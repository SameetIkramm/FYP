import React from 'react'

const services = () => {
  return (
    <div>
      <section id="service">
        <div className="container my-5 py-5">
          <div className="row">
            <div className="col-12">
              <h3 className="fs-5 text-center mb-0"> Why Choose Anigen</h3>
              <h1 className="display-6 text-center mb-4">One of the <b>Best</b> way to make AI Videos</h1>
              <hr className="w-25 mx-auto"/>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-4">
              <div class="card p-3 h-100">
                <img src="/assets/creativeAvatar.jpg" class="card-img-top" alt="..."/>
                <div class="card-body text-center">
                  <h5 class="card-title mb-3 fs-4 fw-bold">Create Avatars That lool like you</h5>
                  <p class="card-text lead">Anigen provides you the facility to create avatars that look like you. You no longer need to worry to face camera.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div class="card p-3 h-100">
                <img src="/assets/TTS.jpg" class="card-img-top w-100" alt="..."/>
                <div class="card-body text-center">
                  <h5 class="card-title mb-3 fs-4 fw-bold">Turn your Text to your own voice</h5>
                  <p class="card-text lead">Anigen provides you the facility to clone your voice. You dont need to use other people's voice in your videos.</p>

                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div class="card p-3 h-100">
                <img src="/assets/crud.jpg" class="card-img-top" alt="..."/>
                <div class="card-body text-center">
                  <h5 class="card-title mb-3 fs-4 fw-bold">Create and update videos in minutes not hours</h5>
                  <p class="card-text lead">You do not need prior video editing skills. Update your video anytime. Share, embed or download it as MP4 without wasting time.</p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default services;
